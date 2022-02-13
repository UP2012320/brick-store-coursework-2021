export interface SearchRequestArguments {
  query: string;
}

export interface SearchQueryResponse {
  colour: string;
  description: string;
  discount?: number;
  discount_price: number;
  id: string;
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
