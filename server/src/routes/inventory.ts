import {sendQuery, validatePermissions} from 'Utils/helpers';
import type {Product, SearchRequestArguments} from 'api-types';
import type {FastifyPluginAsync} from 'fastify';

const inventory: FastifyPluginAsync = async (fastify, options) => {
  fastify.get<{ Querystring: SearchRequestArguments, }>('/search', async (request, reply) => {
    const body = request.query;

    if (!body) {
      reply.badRequest('Invalid JSON body');
      return;
    }

    const direction = body.sort?.startsWith('-') ? 'desc' : 'asc';

    const [searchQueryResult, searchQueryError] = await sendQuery<Product>(
      fastify.pg.pool,
      `SELECT *
       FROM search_inventory($1, $2, $3, $4, $5, $6)`,
      [
        body.query,
        body.offset ?? 0,
        body.colours ? `{${body.colours}}` : null,
        body.types ? `{${body.types}}` : null,
        direction === 'desc' ? body.sort?.slice(1) : body.sort,
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

  fastify.post('/addProduct', {
    preHandler: (request, reply, done) => {
      validatePermissions(request, reply, ['write:product']);
      done();
    },
    // eslint-disable-next-line
    preValidation: fastify.authenticate,
  }, async (request, reply) => {
    reply.status(200).send();
  });
};

export default inventory;
