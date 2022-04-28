import {type FastifyPluginAsync} from 'fastify';
import config from '../config';
import checkout from './checkout';
import inventory from './inventory';
import staff from './staff/staff';

const api: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/getAuth0Config', async (request, response) => {
    response.send({audience: config.audience, clientId: config.clientId, domain: config.domain});
  });

  fastify.register(staff, {prefix: '/staff'});
  fastify.register(inventory);
  fastify.register(checkout, {prefix: '/checkout'});
};

export default api;
