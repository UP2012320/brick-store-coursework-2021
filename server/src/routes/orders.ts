import {sendQuery} from 'Utils/helpers';
import {type CartItem} from 'api-types';
import {type FastifyPluginAsync, type FastifyReply} from 'fastify';
import {nanoid} from 'nanoid';
import {type PoolClient} from 'pg';

export const addOrder = async (client: PoolClient, cartItems: CartItem[], orderId: string, reply: FastifyReply, email?: string, userId?: string) => {
  const [, insertOrderError] = await sendQuery(client,
    'INSERT INTO orders (order_id, date_ordered) VALUES ($1, $2)',
    [orderId, new Date()]);

  if (insertOrderError) {
    console.error(insertOrderError);
    reply.internalServerError();
    return false;
  }

  const [, insertUserOrderError] = await sendQuery(client,
    'INSERT INTO user_orders (user_id, email, order_id) VALUES ($1, $2, $3)',
    [userId, email, orderId]);

  if (insertUserOrderError) {
    console.error(insertUserOrderError);
    reply.internalServerError();
    return false;
  }

  for (const cartItem of cartItems) {
    const [, insertOrderItemError] = await sendQuery(client,
      'INSERT INTO order_items (order_id, inventory_id, quantity) VALUES ($1, $2, $3)',
      [orderId, cartItem.product.inventory_id, cartItem.quantity]);

    if (insertOrderItemError) {
      console.error(insertOrderItemError);
      reply.internalServerError();
      return false;
    }
  }

  return true;
};

const orders: FastifyPluginAsync = async (fastify, options) => {
  fastify.get<{ Querystring: { email?: string, orderId: string, userId?: string, }, }>('/', async (request, reply) => {
    const {email, userId} = request.query;

    if (!email && !userId) {
      reply.badRequest();
      return;
    }

    const [result, error] = await sendQuery(fastify.pg.pool,
      'SELECT * FROM user_orders WHERE (user_id = $1 OR email = $2) AND order_id = $3',
      [userId, email, request.query.orderId]);

    if (error || !result) {
      console.error(error);
      reply.internalServerError();
      return;
    }

    if (!result.rows.length) {
      reply.notFound();
      return;
    }

    reply.status(200).send(result.rows);
  });

  fastify.get<{ Querystring: { userId: string, }, }>('/allUserOrders', async (request, reply) => {
    const {userId} = request.query;

    if (!userId) {
      reply.badRequest();
      return;
    }

    const [result, error] = await sendQuery(fastify.pg.pool,
      `SELECT *
       FROM user_orders
              JOIN orders o on o.order_id = user_orders.order_id
       WHERE user_id = $1`,
      [userId]);

    if (error || !result) {
      console.error(error);
      reply.internalServerError();
      return;
    }

    if (!result.rows.length) {
      reply.notFound();
      return;
    }

    reply.status(200).send(result.rows);
  });

  fastify.post<{ Body: { cartItems: CartItem[], email?: string, userId?: string, }, }>('/', async (request, reply) => {
    const {email, cartItems, userId} = request.body;

    if ((!email && !userId) || !cartItems || cartItems.length === 0) {
      reply.badRequest('Missing required fields');
      return;
    }

    const orderId = nanoid(12);

    const result = await fastify.pg.transact(async (client) => await addOrder(client, cartItems, orderId, reply, email, userId));

    if (!result) {
      return;
    }

    reply.status(200).send();
  });
};

export default orders;
