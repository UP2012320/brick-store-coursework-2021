import {type CartItemRequest} from 'api-types';
import {type FastifyPluginAsync, type FastifyReply} from 'fastify';
import {nanoid} from 'nanoid';
import {type PoolClient} from 'pg';
import {sendQuery} from '../utils/helpers';
import {addOrderSchema, getAllUsersOrdersSchema, getOrderSchema} from './orders.schema';

export const addOrder = async (client: PoolClient, cartItems: CartItemRequest[], orderId: string, reply: FastifyReply, email?: string, userId?: string) => {
  const [, insertOrderError] = await sendQuery(client,
    'INSERT INTO orders (order_id, date_ordered) VALUES ($1, $2)',
    [orderId, new Date()]);

  if (insertOrderError) {
    reply.internalServerError();
    return false;
  }

  const [userExistsResult, userExistsError] = await sendQuery<{exists: boolean, }>(client,
    'SELECT EXISTS (SELECT 1 FROM users WHERE email = $1)',
    [email]);

  if (userExistsError || !userExistsResult?.rows) {
    reply.internalServerError();
    return false;
  }

  const userExists = userExistsResult.rows[0].exists;

  if (!userExists) {
    const [, insertUserError] = await sendQuery(client,
      'INSERT INTO users (email, user_id) VALUES ($1, $2)',
      [email, userId]);

    if (insertUserError) {
      reply.internalServerError();
      return false;
    }
  }

  const [, insertUserOrderError] = await sendQuery(client,
    'INSERT INTO user_orders (email, order_id) VALUES ($1, $2)',
    [email, orderId]);

  if (insertUserOrderError) {
    reply.internalServerError();
    return false;
  }

  for (const cartItem of cartItems) {
    const [, insertOrderItemError] = await sendQuery(client,
      'INSERT INTO order_items (order_id, inventory_id, quantity) VALUES ($1, $2, $3)',
      [orderId, cartItem.inventoryId, cartItem.quantity]);

    if (insertOrderItemError) {
      reply.internalServerError();
      return false;
    }
  }

  return true;
};

const orders: FastifyPluginAsync = async (fastify, options) => {
  fastify.get<{ Querystring: { email?: string, orderId: string, userId?: string, }, }>('/', {schema: getOrderSchema}, async (request, reply) => {
    const {email, orderId, userId} = request.query;

    const [result, error] = await sendQuery(fastify.pg.pool,
      `SELECT * FROM get_all_orders()
             WHERE ("userId" = $1 OR email = $2) AND "orderId" = $3`,
      [userId, email, orderId]);

    if (error || !result) {
      console.error(error);
      reply.internalServerError();
      return;
    }

    if (!result.rows.length) {
      reply.notFound();
      return;
    }

    reply.status(200).send(result.rows[0]);
  });

  fastify.get<{ Querystring: { userId: string, }, }>('/allUsersOrders', {
    schema: getAllUsersOrdersSchema,
  }, async (request, reply) => {
    const {userId} = request.query;

    const [result, error] = await sendQuery(fastify.pg.pool,
      `SELECT * FROM get_all_orders()
             WHERE "userId" = $1
             ORDER BY "dateOrdered" DESC`,
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

  fastify.post<{ Body: { cartItems: CartItemRequest[], email?: string, userId?: string, }, }>('/', {schema: addOrderSchema}, async (request, reply) => {
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

    reply.status(200).send({
      orderId,
    });
  });
};

export default orders;
