import type {FastifyPluginAsync} from 'fastify';
import config from '../config';
import checkout from './checkout';
import images from './images';
import inventory from './inventory';
import staff from './staff';

const api: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/getAuth0Config', async (request, response) => {
    response.send({audience: config.audience, clientId: config.clientId, domain: config.domain});
  });

  fastify.register(staff, {prefix: '/staff'});
  fastify.register(images, {prefix: '/images'});
  fastify.register(inventory);
  fastify.register(checkout, {prefix: '/checkout'});
};

export default api;
