import {validatePermissions} from 'Utils/helpers';
import type {FastifyPluginAsync} from 'fastify';

const staff: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preValidation', fastify.authenticate);
  fastify.addHook('preHandler', async (request, reply) => {
    validatePermissions(request, reply, ['access:management']);
  });

  fastify.get('/', async (request, reply) => {
    reply.send({
      message: 'Staff route',
    });
  });
};

export default staff;
