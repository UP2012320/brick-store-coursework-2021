import {FastifyInstance, FastifyServerOptions} from 'fastify';

export default function api(
  fastify: FastifyInstance,
  opts: FastifyServerOptions,
  done: (err?: Error) => void,
) {
  fastify.get<{Querystring: {sort: string}}>('/', async (request, reply) => {
    return 'Hello World!';
  });

  done();
}
