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
