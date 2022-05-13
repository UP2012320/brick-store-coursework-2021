import {type CartItemRequest} from 'api-types';
import {type FastifyPluginAsync} from 'fastify';
import {nanoid} from 'nanoid';
import {checkIfProductInStock, sendQuery} from '../utils/helpers';
import {checkoutSchema} from './checkout.schema';
import {addOrder} from './orders';

const checkout: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook<{ Body: { cartItems: CartItemRequest[], email?: string, userId?: string, }, }>('preHandler', async (request, reply) => {
    let canCheckout: Array<{ inventoryId: string, stock: number, }> | undefined = [];

    if (request.body) {
      canCheckout = await checkIfProductInStock(fastify.pg.pool, request.body.cartItems);
    } else {
      reply.badRequest();
      return;
    }

    if (!canCheckout) {
      reply.badRequest();
      return;
    }

    if (canCheckout.length > 0) {
      reply.header('Content-Type', 'application/json').status(400).send(canCheckout);
    }
  });

  fastify.post<{ Body: { cartItems: CartItemRequest[], email?: string, userId?: string, }, }>('/', {schema: checkoutSchema}, async (request, reply) => {
    const {cartItems, email, userId} = request.body;

    if ((!email && !userId) || !cartItems || cartItems.length === 0) {
      reply.badRequest('Missing required fields');
      return;
    }

    const result = await fastify.pg.transact(async (client) => {
      for (const cartItem of cartItems) {
        const inventoryId = cartItem.inventoryId;
        const quantity = cartItem.quantity;

        const [, error] = await sendQuery(fastify.pg.pool,
          'UPDATE inventory SET stock = stock - $1 WHERE inventory_id = $2',
          [quantity, inventoryId]);

        if (error) {
          reply.internalServerError();
          return false;
        }
      }

      const orderId = nanoid(12);

      return await addOrder(client, cartItems, orderId, reply, email, userId);
    });

    if (!result) {
      return;
    }

    reply.status(200).send();
  });
};

export default checkout;
