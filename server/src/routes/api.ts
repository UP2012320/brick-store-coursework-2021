import {sendQuery} from 'Utils/helpers.js';
import type {LocalCartItem, SearchQueryResponse, SearchRequestArguments} from 'api-types';
import config from 'config';
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
       FROM search_inventory($1, $2)`,
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

  fastify.get<{ Querystring: { slug: string, }, }>('/getProductBySlug', async (request, reply) => {
    const [productDetails, error] = await sendQuery(fastify.pg.pool,
      'SELECT * FROM get_product_by_slug($1)',
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

  fastify.get<{ Querystring: { inventoryId: string, }, }>('/getProductByInventoryId', async (request, reply) => {
    const [productDetails, error] = await sendQuery(fastify.pg.pool,
      'SELECT * FROM get_product_by_inventory_id($1)',
      [request.query.inventoryId]);

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

  fastify.get('/getAuth0Config', async (request, response) => {
    response.send({clientId: config.clientId, domain: config.domain});
  });

  fastify.get<{ Querystring: { userId: string, }, }>('/getCart', async (request, response) => {
    const {userId} = request.query;

    if (!userId) {
      response.badRequest();
      return;
    }

    const [result, error] = await sendQuery(fastify.pg.pool,
      `
        SELECT json_build_object('product', p.*, 'quantity', c.quantity) AS "item"
        FROM cart c
               JOIN inventory i on i.inventory_id = c.inventory_id
               LEFT JOIN LATERAL (
          SELECT * FROM get_product_by_inventory_id(i.inventory_id)
          ) AS p ON TRUE
        WHERE user_id = $1;
      `,
      [userId]);

    if (error) {
      console.error(error);
      response.internalServerError();
      return;
    }

    if (result?.rows) {
      const rows = result.rows as Array<{ item: LocalCartItem, }>;

      response.send(rows.map((row) => row.item));
      return;
    }

    response.notFound();
  });

  fastify.post<{ Body: { inventoryId: string, quantity: number, userId: string, }, }>('/updateCart', async (request, response) => {
    const {inventoryId, quantity, userId} = request.body;

    if (!inventoryId || !quantity || !userId) {
      response.badRequest();
      return;
    }

    const [result, error] = await sendQuery(fastify.pg.pool,
      'CALL update_cart_item($1, $2, $3);',
      [userId, inventoryId, quantity]);

    if (error) {
      console.error(error);
      response.internalServerError();
      return;
    }

    response.status(200).send();
  });

  fastify.delete<{ Querystring: { inventoryId: string, userId: string, }, }>('/deleteFromCart', async (request, response) => {
    const {inventoryId, userId} = request.query;

    if (!inventoryId || !userId) {
      response.badRequest();
      return;
    }

    const [result, error] = await sendQuery(fastify.pg.pool,
      'DELETE FROM cart WHERE user_id = $1 AND inventory_id = $2',
      [userId, inventoryId]);

    if (error) {
      console.error(error);
      response.internalServerError();
      return;
    }

    response.status(200).send();
  });

  done();
}
