import {FastifyInstance, FastifyServerOptions} from 'fastify';
import {sendQuery} from '../utils/helpers';
import {DatabaseError} from 'pg';

interface SearchBody {
  query: string;
  colour?: number;
  size?: number;
  type?: number;
  price?: {
    min?: number;
    max?: number;
  };
  in_stock?: boolean;
  has_discount?: boolean;
  page?: number;
  sort?: string;
  sortDirection?: string;
}

export default function api(
  fastify: FastifyInstance,
  opts: FastifyServerOptions,
  done: (err?: Error) => void,
) {
  fastify.post<{Body: SearchBody}>('/search', async (request, reply) => {
    const body = request.body;

    if (!body) {
      reply.badRequest('Invalid JSON body');
      return;
    }

    console.debug(body);

    const pg = await fastify.pg.connect();

    const likeQuery = body.query ? `%${body.query}%` : undefined;

    const [searchQueryResult, err] = await sendQuery(
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

    if (err) {
      if (err instanceof DatabaseError) {
        if (err.code === '22023') {
          reply.badRequest(err.message);
          return;
        }
      }

      reply.internalServerError();
      return;
    }

    if (searchQueryResult) {
      return searchQueryResult.rows;
    }

    reply.internalServerError();
    return;
  });

  fastify.get('/getBrickTypes', async (request, reply) => {
    const pg = await fastify.pg.connect();

    const [brickTypes] = await sendQuery(pg, 'SELECT * FROM brick_types');

    if (!brickTypes) {
      reply.internalServerError();
      return;
    }

    return brickTypes.rows;
  });

  fastify.get('/getBrickSizes', async (request, reply) => {
    const pg = await fastify.pg.connect();

    const [brickSizes] = await sendQuery(pg, 'SELECT * FROM brick_sizes');

    if (!brickSizes) {
      reply.internalServerError();
      return;
    }

    return brickSizes.rows;
  });

  fastify.get('/getBrickColours', async (request, reply) => {
    const pg = await fastify.pg.connect();

    const [brickColours] = await sendQuery(pg, 'SELECT * FROM brick_colours');

    if (!brickColours) {
      reply.internalServerError();
      return;
    }

    return brickColours.rows;
  });

  done();
}
