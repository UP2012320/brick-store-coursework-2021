import type {CartItem} from 'api-types';
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
