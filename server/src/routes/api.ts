import type {JWTPayload} from 'api-types';
import type {FastifyPluginAsync} from 'fastify';
import config from '../config';
import checkout from './checkout';
import inventory from './inventory';

const api: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('/getAuth0Config', async (request, response) => {
    response.send({audience: config.audience, clientId: config.clientId, domain: config.domain});
  });

  fastify.get('/canAccessManagementPanel', async (request, reply) => {
    if (typeof request.user === 'object') {
      const userAuth = request.user as JWTPayload;

      if (!userAuth.aud.includes('staff')) {
        reply.unauthorized();
        return;
      }
    } else {
      reply.badRequest();
      return;
    }

    reply.status(200).send();
  });

  fastify.register(inventory);
  fastify.register(checkout, {prefix: '/checkout'});
};

export default api;
