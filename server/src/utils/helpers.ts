import {PoolClient, QueryConfig} from 'pg';

export async function sendQuery(
  pg: PoolClient,
  query: string | QueryConfig,
  values?: string[],
) {
  let queryResponse;

  try {
    queryResponse = await pg.query(query, values);
  } catch (e) {
    // LOG
    console.debug(e);
    return undefined;
  }

  return queryResponse;
}
