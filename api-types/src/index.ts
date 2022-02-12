export interface SearchRequestArguments {
  colour?: number;
  in_stock?: boolean;
  limit?: number;
  order?: {
    column?: string,
    direction?: number,
  };
  page?: number;
  price?: {
    max?: number,
    min?: number,
  };
  query: string;
  type?: number;
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
