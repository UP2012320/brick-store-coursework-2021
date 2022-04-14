import {checkIfProductInStock, sendQuery} from 'Utils/helpers';
import type {CartItem} from 'api-types';
import type {FastifyPluginAsync} from 'fastify';

const checkout: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook<{ Body?: CartItem[], }>('preHandler', async (request, reply) => {
    let canCheckout: Array<{ inventoryId: string, stock: number, }> | undefined = [];

    if (request.body) {
      canCheckout = await checkIfProductInStock(fastify.pg.pool, request.body);
    } else {
      reply.badRequest();
      return;
    }

    if (!canCheckout) {
      reply.badRequest();
      return;
    }

    if (canCheckout.length > 0) {
      reply.header('Content-Type', 'application/json');
      reply.status(400).send(canCheckout);
    }
  });

  fastify.post<{ Body: CartItem[], }>('/', async (request, response) => {
    const cartItems = request.body;

    if (!cartItems || cartItems.length === 0) {
      response.badRequest();
      return;
    }

    for (const cartItem of cartItems) {
      const inventoryId = cartItem.product.inventory_id;
      const quantity = cartItem.quantity;

      const [, error] = await sendQuery(fastify.pg.pool,
        'UPDATE inventory SET stock = stock - $1 WHERE inventory_id = $2',
        [quantity, inventoryId]);

      if (error) {
        response.internalServerError();
        return;
      }
    }

    response.status(200).send();
  });
};

export default checkout;
