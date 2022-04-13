import type {FastifyPluginAsync} from 'fastify';
import api from './routes/api.js';

const base: FastifyPluginAsync = async (fastify, options) => {
  fastify.get('*', async (request, reply) => {
    await reply.sendFile('index.html');
  });

  await fastify.register(api, {prefix: '/api/v1'});
};

export default base;
