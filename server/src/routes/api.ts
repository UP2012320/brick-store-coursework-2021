import type {FastifyInstance, FastifyServerOptions} from 'fastify';
import {DatabaseError} from 'pg';
import {sendQuery} from '../utils/helpers';

type SearchBody = {
  colour?: number,
  has_discount?: boolean,
  in_stock?: boolean,
  page?: number,
  price?: {
    max?: number,
    min?: number,
  },
  query: string,
  size?: number,
  sort?: string,
  sortDirection?: string,
  type?: number,
};

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

    const likeQuery = body.query ? `%${body.query}%` : undefined;

    const [searchQueryResult, error] = await sendQuery(
      pg,
      `SELECT *
       FROM search_inventory($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        likeQuery,
        body.colour,
        body.type,
        body.size,
        body.price?.min,
        body.price?.max,
        body.in_stock,
        body.has_discount,
        50 * (body.page ?? 0),
        body.sort,
        body.sortDirection,
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

  fastify.get('/getBrickSizes', async (request, reply) => {
    const pg = await fastify.pg.connect();

    const [brickSizes] = await sendQuery(pg, 'SELECT * FROM brick_sizes');

    if (!brickSizes) {
      reply.internalServerError();
      return;
    }

    await reply.send(brickSizes.rows);
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
