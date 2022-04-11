import {sendQuery} from 'Utils/helpers.js';
import type {CartItem, Product, SearchRequestArguments} from 'api-types';
import type {FastifyInstance, FastifyServerOptions} from 'fastify';
import config from '../config';

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

    const direction = body.order?.startsWith('-') ? 'desc' : 'asc';

    const [searchQueryResult, searchQueryError] = await sendQuery<Product>(
      fastify.pg.pool,
      `SELECT *
       FROM search_inventory($1, $2, $3, $4, $5, $6)`,
      [
        body.query,
        body.offset ?? 0,
        body.colours ? `{${body.colours}}` : null,
        body.types ? `{${body.types}}` : null,
        direction === 'desc' ? body.order?.slice(1) : body.order,
        direction,
      ],
    );

    if (searchQueryError) {
      console.debug(searchQueryError);
      reply.internalServerError();
      return;
    }

    if (searchQueryResult) {
      await reply.send({
        results: searchQueryResult.rows,
      });
    } else {
      await reply.send({
        results: [],
      });
    }
  });

  fastify.get('/getBrickTypes', async (request, reply) => {
    const [brickTypes, error] = await sendQuery(fastify.pg.pool, 'SELECT type_id as "id", type_name as "type" FROM brick_types ORDER BY type_name');

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
      'SELECT colour_id as "id", colour_name as "name" FROM brick_colours ORDER BY colour_name');

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
      const rows = result.rows as Array<{ item: CartItem, }>;

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

  fastify.delete<{ Body: { inventoryId: string, userId: string, }, }>('/deleteFromCart', async (request, response) => {
    const {inventoryId, userId} = request.body;

    if (!inventoryId || !userId) {
      response.badRequest();
      return;
    }

    const [, error] = await sendQuery(fastify.pg.pool,
      'DELETE FROM cart WHERE user_id = $1 AND inventory_id = $2',
      [userId, inventoryId]);

    if (error) {
      console.error(error);
      response.internalServerError();
      return;
    }

    response.status(200).send();
  });

  fastify.get<{ Querystring: { userId: string, }, }>('/canCheckout', async (request, response) => {
    const {userId} = request.query;

    if (!userId) {
      response.badRequest();
    }

    const [cartItems, error] = await sendQuery<{ inventory_id: string, quantity: number, stock: number, }>(fastify.pg.pool, `
  SELECT c.inventory_id, quantity, i.stock
  FROM cart c
         JOIN inventory i ON c.inventory_id = i.inventory_id
  WHERE user_id = $1
`, [userId]);

    if (error) {
      console.error(error);
      response.internalServerError();
      return;
    }

    if (!cartItems || cartItems.rowCount === 0) {
      // Not sure if this is the best response code to use
      response.badRequest();
      return;
    }

    const responseBody = [];

    for (const row of cartItems.rows) {
      if (row.stock - row.quantity < 0) {
        responseBody.push(row.inventory_id);
      }
    }

    response.send(responseBody);
  });

  fastify.get<{ Querystring: { userId: string, }, }>('/checkout', async (request, response) => {
    const {userId} = request.query;

    if (!userId) {
      response.badRequest();
    }
  });

  done();
}
