import {PoolClient, QueryConfig, QueryResult} from 'pg';

export async function sendQuery(
  pg: PoolClient,
  query: string | QueryConfig,
  values?: unknown[],
): Promise<[QueryResult | undefined, unknown | undefined]> {
  let queryResponse;

  try {
    queryResponse = await pg.query(query, values);
  } catch (e) {
    // LOG
    console.debug(e);
    return [undefined, e];
  }

  return [queryResponse, undefined];
}
