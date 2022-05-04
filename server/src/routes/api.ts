import {type FastifyPluginAsync} from 'fastify';
import config from '../config';
import checkout from './checkout';
import inventory from './inventory';
import orders from './orders';
import {addSchemas} from './schemas';
import staff from './staff/staff';

const api: FastifyPluginAsync = async (fastify, options) => {
  addSchemas(fastify);

  fastify.get('/getAuth0Config', {schema: {
    description: 'Get Auth0 configuration',
    response: {
      '200': {
        properties: {
          audience: {type: 'string'},
          clientId: {type: 'string'},
          domain: {type: 'string'},
        },
        type: 'object',
      },
    },
    tags: ['api'],
  }}, async (request, response) => {
    response.send({audience: config.audience, clientId: config.clientId, domain: config.domain});
  });

  fastify.register(staff, {prefix: '/staff'});
  fastify.register(inventory);
  fastify.register(orders, {prefix: '/orders'});
  fastify.register(checkout, {prefix: '/checkout'});
};

export default api;
