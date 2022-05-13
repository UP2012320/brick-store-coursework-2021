import {type OrderInfo} from 'api-types';
import {type FastifyPluginAsync} from 'fastify';
import {sendQuery, validatePermissions} from '../../utils/helpers';
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
      const [, userOrdersError] = await sendQuery(client, `
      DELETE FROM user_orders WHERE order_id = $1;
      `, [id]);

      const [, orderItemsError] = await sendQuery(client, `
      DELETE FROM order_items WHERE order_id = $1;
      `, [id]);

      const [, ordersError] = await sendQuery(client, `
      DELETE FROM orders WHERE order_id = $1;
      `, [id]);

      if (userOrdersError || orderItemsError || ordersError) {
        console.error(userOrdersError, orderItemsError, ordersError);
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
