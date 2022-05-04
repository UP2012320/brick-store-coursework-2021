import {sendQuery, validatePermissions} from 'Utils/helpers';
import {type OrderInfo} from 'api-types';
import {type FastifyPluginAsync} from 'fastify';
import {deleteOrderSchema, getAllOrdersSchema} from './orders.schema';

const orders: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preHandler', async (request, reply) => {
    validatePermissions(request, reply, ['read:allOrders', 'delete:orders']);
  });

  fastify.get('/allOrders', {schema: getAllOrdersSchema}, async (request, reply) => {
    const [result, error] = await sendQuery<OrderInfo>(fastify.pg.pool, 'SELECT * FROM get_all_orders();');

    if (error || !result) {
      console.error(error);
      reply.internalServerError();
      return;
    }

    reply.status(200).send(result.rows);
  });

  fastify.delete<{ Params: { id: string, }, }>('/:id', {schema: deleteOrderSchema}, async (request, reply) => {
    const {id} = request.params;

    const result = await fastify.pg.transact(async (client) => {
      const [, error] = await sendQuery(client, `
      DELETE FROM user_orders WHERE order_id = $1;
      DELETE FROM order_items WHERE order_id = $1;
      DELETE FROM orders WHERE order_id = $1;
      `, [id]);

      if (error && error.code === '23503') {
        reply.badRequest('Order not found');
        return false;
      } else if (error) {
        console.error(error);
        reply.internalServerError();
        return false;
      }

      return true;
    });

    if (!result) {
      return;
    }

    reply.status(200).send();
  });
};

export default orders;
