import {FastifyInstance, FastifyServerOptions} from 'fastify';

interface SearchBody {
  query: string;
  colour?: string;
  size?: string;
  type?: string;
  price?: {
    min?: number;
    max?: number;
  };
  in_stock?: boolean;
  page?: number;
  sort?: string;
}

export default function api(
  fastify: FastifyInstance,
  opts: FastifyServerOptions,
  done: (err?: Error) => void,
) {
  fastify.post<{Body: SearchBody}>('/search', async (request, reply) => {
    const body = request.body;

    if (!body || !body.query) {
      reply.badRequest('Invalid JSON body');
      return;
    }

    let pg;

    try {
      pg = await fastify.pg.connect();
    } catch (e) {
      console.debug(e);
      reply.internalServerError();
      return;
    }

    try {
      /*const f = await pg.query(
        `SELECT *
         FROM inventory
         WHERE item_name ILIKE '%' || $1 || '%'
           AND colour ILIKE '%' || $2 || '%'
           AND size ILIKE '%' || $3 || '%'
           AND type ILIKE '%' || $4 || '%'
           AND (price >= $5 AND price <= $6)
           AND stock >= $7
         ORDER BY $8
         OFFSET $9 LIMIT 50`,
        [
          body.query,
          body.colour ?? '',
          body.size ?? '',
          body.type ?? '',
          body.price?.min ?? 0,
          body.price?.max ?? Number.MAX_VALUE,
          body.in_stock ? 1 : 0,
          body.sort ?? 'item_name',
          50 * (body.page ?? 0),
        ],
      );*/

      const f = await pg.query(
        `SELECT *
                                FROM inventory
                                WHERE item_name ILIKE '%' || $1 || '%'
                                LIMIT 10;`,
        [body.query],
      );

      console.debug(f.rows);
      return f.rows;
    } catch (e) {
      console.debug(e);
    }

    console.debug(body);

    return 'Hello World!';
  });

  done();
}
