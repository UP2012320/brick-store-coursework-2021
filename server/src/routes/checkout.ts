import {checkIfCanCheckout, sendQuery} from 'Utils/helpers';
import type {CartItem} from 'api-types';
import type {FastifyPluginCallback} from 'fastify';

const checkout: FastifyPluginCallback = (fastify, options, done) => {
  fastify.addHook<{ Body?: CartItem[], }>('preHandler', async (request, reply) => {
    let canCheckout: Array<{ inventoryId: string, stock: number, }> | undefined = [];

    if (request.body) {
      canCheckout = await checkIfCanCheckout(fastify.pg.pool, request.body);
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
      return;
    }

    done();
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

  done();
};

export default checkout;
