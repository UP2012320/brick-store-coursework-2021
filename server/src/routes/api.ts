import {sendQuery} from 'Utils/helpers.js';
import type {FastifyInstance, FastifyServerOptions} from 'fastify';
import {DatabaseError} from 'pg';
import type {SearchBody} from 'types/types';

export default function api (
  fastify: FastifyInstance,
  options: FastifyServerOptions,
  done: (error?: Error) => void,
) {
  fastify.post<{ Body: SearchBody, }>('/search', async (request, reply) => {
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
       FROM search_inventory($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        body.query,
        body.colour,
        body.type,
        body.price?.min,
        body.price?.max,
        body.in_stock,
        body.order?.column,
        body.order?.direction,
        50 * (body.page ?? 0),
        body.limit,
      ],
    );

    if (error) {
      if (error instanceof DatabaseError && error.code === '22023') {
        reply.badRequest(error.message);
        return;
      }

      reply.internalServerError();
      return;
    }

    if (searchQueryResult) {
      await reply.send(searchQueryResult.rows);
    }

    reply.internalServerError();
  });

  fastify.get('/getBrickTypes', async (request, reply) => {
    const pg = await fastify.pg.connect();

    const [brickTypes] = await sendQuery(pg, 'SELECT * FROM brick_types');

    if (!brickTypes) {
      reply.internalServerError();
      return;
    }

    await reply.send(brickTypes.rows);
  });

  fastify.get('/getBrickColours', async (request, reply) => {
    const pg = await fastify.pg.connect();

    const [brickColours] = await sendQuery(pg, 'SELECT * FROM brick_colours');

    if (!brickColours) {
      reply.internalServerError();
      return;
    }

    await reply.send(brickColours.rows);
  });

  done();
}
