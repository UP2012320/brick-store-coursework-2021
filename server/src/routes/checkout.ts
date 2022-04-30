import {checkIfProductInStock, sendQuery} from 'Utils/helpers';
import {type CartItem} from 'api-types';
import {type FastifyPluginAsync} from 'fastify';
import {nanoid} from 'nanoid';
import {addOrder} from './orders';

const checkout: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook<{ Body: { cartItems: CartItem[], email?: string, userId?: string, }, }>('preHandler', async (request, reply) => {
    let canCheckout: Array<{ inventoryId: string, stock: number, }> | undefined = [];

    if (request.body) {
      canCheckout = await checkIfProductInStock(fastify.pg.pool, request.body.cartItems);
    } else {
      reply.badRequest();
      return;
    }

    console.debug(canCheckout);

    if (!canCheckout) {
      reply.badRequest();
      return;
    }

    if (canCheckout.length > 0) {
      reply.header('Content-Type', 'application/json').status(400).send(canCheckout);
    }
  });

  fastify.post<{ Body: { cartItems: CartItem[], email?: string, userId?: string, }, }>('/', async (request, reply) => {
    const {cartItems, email, userId} = request.body;

    if ((!email && !userId) || !cartItems || cartItems.length === 0) {
      reply.badRequest('Missing required fields');
      return;
    }

    if (email && !/^\S+@\S+\.\S+$/gmiu.test(email)) {
      reply.badRequest('Invalid email');
      return;
    }

    const result = await fastify.pg.transact(async (client) => {
      for (const cartItem of cartItems) {
        const inventoryId = cartItem.product.inventory_id;
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
