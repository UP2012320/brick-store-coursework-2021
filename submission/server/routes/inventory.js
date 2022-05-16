import {sendQuery} from '../utils/helpers';
import {
  getBrickColoursSchema,
  getBrickTypesSchema,
  getProductByInventoryIdSchema,
  getProductBySlugSchema,
  searchSchema
} from './inventory.schema';

const returnSearchResults = async (searchResult, searchError, reply) => {
  if (searchError) {
    console.error(searchError);
    reply.internalServerError();
    return;
  }
  if (searchResult?.rows && searchResult.rows.length > 0) {
    const products = searchResult.rows.map((row) => ({
      ...row,
      images: row.images?.split(', ') ?? [],
    }));
    await reply.send(products);
  } else {
    reply.notFound();
  }
};
const inventory = async (fastify, options) => {
  fastify.get('/search', {schema: searchSchema}, async (request, reply) => {
    const query = request.query;
    const direction = query.sort?.startsWith('-') ? 'desc' : 'asc';
    const [searchQueryResult, searchQueryError] = await sendQuery(fastify.pg.pool, `SELECT *
       FROM search_inventory($1, $2, $3, $4, $5, $6, null)`, [
      query.query,
      query.offset ?? 0,
      query.colours ? `{${query.colours}}` : null,
      query.types ? `{${query.types}}` : null,
      direction === 'desc' ? query.sort?.slice(1) : query.sort,
      direction,
    ]);
    await returnSearchResults(searchQueryResult, searchQueryError, reply);
  });
  fastify.get('/getBrickTypes', {schema: getBrickTypesSchema}, async (request, reply) => {
    const [brickTypes, error] = await sendQuery(fastify.pg.pool,
      'SELECT type_id as "id", type_name as "type" FROM brick_types ORDER BY type_name'
    );
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
  fastify.get('/getBrickColours', {schema: getBrickColoursSchema}, async (request, reply) => {
    const [brickColours, error] = await sendQuery(fastify.pg.pool,
      'SELECT colour_id as "id", colour_name as "name" FROM brick_colours ORDER BY colour_name'
    );
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
  fastify.get('/getProductBySlug', {schema: getProductBySlugSchema}, async (request, reply) => {
    const [productDetails, error] = await sendQuery(fastify.pg.pool,
      'SELECT * FROM search_inventory(null, null, null, null, null, null, $1)',
      [request.query.slug]
    );
    await returnSearchResults(productDetails, error, reply);
  });
  fastify.get('/getProductByInventoryId', {schema: getProductByInventoryIdSchema}, async (request, reply) => {
    const [productDetails, error] = await sendQuery(fastify.pg.pool,
      'SELECT * FROM get_product_by_inventory_id($1)',
      [request.query.inventoryId]
    );
    await returnSearchResults(productDetails, error, reply);
  });
};
export default inventory;
