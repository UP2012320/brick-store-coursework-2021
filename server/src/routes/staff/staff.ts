import {validatePermissions} from 'Utils/helpers';
import {type FastifyPluginAsync} from 'fastify';
import images from './images';
import products from './products';

const staff: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preValidation', fastify.authenticate);
  fastify.addHook('preHandler', async (request, reply) => {
    validatePermissions(request, reply, ['access:management']);
  });

  fastify.register(images, {prefix: '/images'});
  fastify.register(products, {prefix: '/products'});

  fastify.get('/authorized', async (request, reply) => {
    reply.status(200).send();
  });
};

export default staff;
