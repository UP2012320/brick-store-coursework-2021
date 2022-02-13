import {sendQuery} from 'Utils/helpers.js';
import type {SearchRequestArguments} from 'api-types';
import type {FastifyInstance, FastifyServerOptions} from 'fastify';

export default function api (
  fastify: FastifyInstance,
  options: FastifyServerOptions,
  done: (error?: Error) => void,
) {
  fastify.post<{ Body: SearchRequestArguments, }>('/search', async (request, reply) => {
    const body = request.body;

    if (!body) {
      reply.badRequest('Invalid JSON body');
      return;
    }

    console.debug(body);

    const pg = await fastify.pg.connect();

    const [searchQueryResult, error] = await sendQuery(
      pg,
      `SELECT *
       FROM search_inventory($1)`,
      [
        body.query,
      ],
    );

    pg.release();

    if (error) {
      console.debug(error);
      reply.internalServerError();
      return;
    }

    if (searchQueryResult) {
      await reply.send(searchQueryResult.rows);
      return;
    }

    reply.internalServerError();
  });

  fastify.get('/getBrickTypes', async (request, reply) => {
    const pg = await fastify.pg.connect();

    const [brickTypes, error] = await sendQuery(pg, 'SELECT type_id as "id", type_name as "type" FROM brick_types');

    pg.release();

    if (error) {
      console.debug(error);
      reply.internalServerError();
      return;
    }

    if (brickTypes) {
      await reply.send(brickTypes.rows);
      return;
    }

    reply.internalServerError();
  });

  fastify.get('/getBrickColours', async (request, reply) => {
    const pg = await fastify.pg.connect();

    const [brickColours, error] = await sendQuery(pg, 'SELECT colour_id as "id", colour_name as "name" FROM brick_colours');

    pg.release();

    if (error) {
      console.debug(error);
      reply.internalServerError();
      return;
    }

    if (brickColours) {
      await reply.send(brickColours.rows);
      return;
    }

    reply.internalServerError();
  });

  done();
}
