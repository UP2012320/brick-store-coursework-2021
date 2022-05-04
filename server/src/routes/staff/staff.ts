import {validatePermissions} from 'Utils/helpers';
import {type FastifyPluginAsync} from 'fastify';
import images from './images';
import orders from './orders';
import products from './products';

const staff: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('preValidation', fastify.authenticate);
  fastify.addHook('preHandler', async (request, reply) => {
    validatePermissions(request, reply, ['access:management']);
  });

  fastify.register(images, {prefix: '/images'});
  fastify.register(products, {prefix: '/products'});
  fastify.register(orders, {prefix: '/orders'});

  fastify.get('/authorized', {
    schema: {
      description: 'Check if user is authorized as staff',
      response: {
        '200': {
          description: 'User is authorized as staff',
          type: 'null',
        },
        default: {
          $ref: 'defaultResponseSchema',
          description: 'User is not authorized as staff',
        },
      },
      tags: ['staff'],
    },
  }, async (request, reply) => {
    reply.status(200).send();
  });
};

export default staff;
