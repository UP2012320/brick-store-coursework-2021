export interface SearchRequestArguments {
  offset?: number;
  query: string;
}

export interface SearchQueryResponse {
  nextId: number;
  results: SearchQueryResult[];
}

export interface SearchQueryResult {
  colour: string;
  description: string;
  discount?: number;
  discount_price: number;
  inventory_id: string;
  name: string;
  price: number;
  slug: string;
  stock: number;
  type: string;
}

export interface GetBrickColoursResponse {
  id: string;
  name: string;
}

export interface GetBrickTypesResponse {
  id: string;
  type: string;
}
