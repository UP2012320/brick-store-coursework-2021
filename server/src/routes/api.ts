import {sendQuery} from 'Utils/helpers.js';
import type {SearchQueryResponse, SearchRequestArguments} from 'api-types';
import type {FastifyInstance, FastifyServerOptions} from 'fastify';

export default function api (
  fastify: FastifyInstance,
  options: FastifyServerOptions,
  done: (error?: Error) => void,
) {
  fastify.get<{ Querystring: SearchRequestArguments, }>('/search', async (request, reply) => {
    const body = request.query;

    if (!body) {
      reply.badRequest('Invalid JSON body');
      return;
    }

    const [searchQueryResult, searchQueryError] = await sendQuery(
      fastify.pg.pool,
      `SELECT *
       FROM search_inventory($1, NULL, $2)`,
      [
        body.query,
        body.offset ?? 0,
      ],
    );

    if (searchQueryError) {
      console.debug(searchQueryError);
      reply.internalServerError();
      return;
    }

    if (searchQueryResult) {
      let finalResult: SearchQueryResponse;

      if (searchQueryResult.rowCount > 0) {
        const [nextIdResult, nextIdError] = await sendQuery(
          fastify.pg.pool,
          'SELECT id FROM inventory WHERE inventory_id = $1',
          [searchQueryResult.rows.slice(-1)[0].inventory_id],
        );

        if (nextIdError) {
          console.debug(nextIdError);
          reply.internalServerError();
          return;
        }

        if (nextIdResult) {
          finalResult = {
            nextId: nextIdResult.rows[0].id,
            results: searchQueryResult.rows,
          };
        } else {
          reply.internalServerError();
          return;
        }
      } else {
        finalResult = {
          nextId: 0,
          results: searchQueryResult.rows,
        };
      }

      await reply.send(finalResult);
      return;
    }

    reply.internalServerError();
  });

  fastify.get('/getBrickTypes', async (request, reply) => {
    const [brickTypes, error] = await sendQuery(fastify.pg.pool, 'SELECT type_id as "id", type_name as "type" FROM brick_types');

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

  fastify.get<{ Querystring: { slug: string, }, }>('/getProduct', async (request, reply) => {
    const [productDetails, error] = await sendQuery(fastify.pg.pool,
      'SELECT * FROM search_inventory(NULL, $1)',
      [request.query.slug]);

    if (error) {
      console.debug(error);
      reply.internalServerError();
      return;
    }

    if (productDetails?.rows) {
      await reply.send(productDetails.rows);
      return;
    }

    reply.internalServerError();
  });

  fastify.get('/getBrickColours', async (request, reply) => {
    const [brickColours, error] = await sendQuery(fastify.pg.pool,
      'SELECT colour_id as "id", colour_name as "name" FROM brick_colours');

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
