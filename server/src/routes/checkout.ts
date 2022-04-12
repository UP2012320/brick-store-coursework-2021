import {checkIfCanCheckout, checkIfUserCanCheckout} from 'Utils/helpers';
import type {CartItem} from 'api-types';
import type {FastifyPluginCallback} from 'fastify';

const checkout: FastifyPluginCallback = (fastify, options, done) => {
  fastify.addHook<{ Body?: CartItem[], Params: { userId?: string, }, }>('onRequest', async (request, reply) => {
    let canCheckout: Array<{ inventoryId: string, stock: number, }> | undefined = [];

    if (request.params?.userId) {
      canCheckout = await checkIfUserCanCheckout(fastify.pg.pool, request.params.userId);
    } else if (request.body) {
      canCheckout = await checkIfCanCheckout(fastify.pg.pool, request.body);
    } else {
      reply.badRequest('Missing userId or cart items');
      return;
    }

    if (!canCheckout) {
      reply.badRequest();
      return;
    }

    if (canCheckout.length > 0) {
      reply.header('Content-Type', 'application/json');
      reply.status(400).send(canCheckout);
      return;
    }

    done();
  });

  fastify.get<{ Params: { userId: string, }, }>('/:userId', async (request, response) => {
    const {userId} = request.params;

    if (!userId) {
      response.badRequest();
      return;
    }

    response.status(200).send();
  });

  fastify.post<{ Body: CartItem[], }>('/', async (request, response) => {
    const cartItems = request.body;

    if (!cartItems || cartItems.length === 0) {
      response.badRequest();
      return;
    }

    response.status(200).send();
  });

  done();
};

export default checkout;
