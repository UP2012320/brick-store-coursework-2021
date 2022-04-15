import type {CartItem, JWTPayload} from 'api-types';
import type {FastifyReply, FastifyRequest} from 'fastify';
import type {Pool, PoolClient, QueryConfig, QueryResult} from 'pg';

export const sendQuery = async <T>(
  pg: Pool | PoolClient,
  query: QueryConfig | string,
  values?: unknown[],
): Promise<[QueryResult<T> | undefined, unknown | undefined]> => {
  let queryResponse;

  try {
    queryResponse = await pg.query(query, values);
  } catch (error) {
    // LOG
    console.debug(error);
    return [undefined, error];
  }

  return [queryResponse, undefined];
};

export const checkIfProductInStock = async (pg: Pool | PoolClient, cartItems: CartItem[]) => {
  const responseBody = [];

  for (const product of cartItems) {
    const [result, error] = await sendQuery(pg,
      'SELECT stock FROM inventory WHERE inventory_id = $1',
      [product.product.inventory_id]);

    if (error || !result) {
      console.error(error);
      return undefined;
    }

    if (result.rows?.length === 0) {
      return [];
    }

    const row = result.rows[0] as { stock: number, };

    if (row.stock - product.quantity < 0) {
      responseBody.push({inventoryId: product.product.inventory_id, stock: row.stock});
    }
  }

  return responseBody;
};

export const validatePermissions = (request: FastifyRequest, reply: FastifyReply, permissions: string[], all = false) => {
  if (typeof request.user === 'object') {
    const userAuth = request.user as JWTPayload;

    if (!userAuth.permissions) {
      reply.badRequest();
      return;
    }

    let result;

    if (all) {
      result = permissions.every((permission) => userAuth.permissions.includes(permission));
    } else {
      result = permissions.some((permission) => userAuth.permissions.includes(permission));
    }

    if (!result) {
      reply.forbidden();
    }
  } else {
    reply.badRequest();
  }
};
