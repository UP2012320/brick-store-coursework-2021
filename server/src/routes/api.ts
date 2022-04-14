import type {FastifyPluginAsync} from 'fastify';
import inventory from 'routes/inventory';
import config from '../config';
import checkout from './checkout';

const api: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/getAuth0Config', async (request, response) => {
    response.send({clientId: config.clientId, domain: config.domain});
  });

  fastify.register(inventory);
  fastify.register(checkout, {prefix: '/checkout'});
};

export default api;
