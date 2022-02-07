import {sendQuery} from 'Utils/helpers.js';
import type {FastifyInstance, FastifyServerOptions} from 'fastify';
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

    if (body.price?.min && body.price.min < 0) {
      body.price.min = 0;
    }

    if (body.limit) {
      if (body.limit < 0) {
        body.limit = undefined;
      } else if (body.limit > 100) {
        body.limit = 100;
      }
    }

    if (body.page && body.page < 0) {
      body.page = 0;
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
        body.in_stock ? 1 : 0,
        body.order?.column,
        body.order?.direction,
        50 * (body.page ?? 0),
        body.limit,
      ],
    );

    if (error) {
      reply.internalServerError();
      return;
    }

    if (searchQueryResult) {
      console.debug(searchQueryResult.rows.length);
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
