import {validatePermissions} from 'Utils/helpers';
import type {FastifyPluginAsync} from 'fastify';

const staff: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preValidation', fastify.authenticate);
  fastify.addHook('preHandler', async (request, reply) => {
    validatePermissions(request, reply, ['access:management']);
  });

  fastify.get('/authorized', async (request, reply) => {
    reply.status(200).send();
  });
};

export default staff;
