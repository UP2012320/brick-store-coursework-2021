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
