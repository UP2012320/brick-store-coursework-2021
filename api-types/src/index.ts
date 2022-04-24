export interface SearchRequestArguments {
  colours?: string;
  offset?: number;
  query: string;
  sort?: string;
  types?: string;
}

export interface SearchQueryResponse {
  results: Product[];
}

export interface Product {
  colour: string;
  description: string;
  discount?: number;
  discount_price: number;
  imageUrl?: string;
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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface JWTPayload {
  aud: string[];
  azp: string;
  exp: number;
  iat: number;
  iss: string;
  permissions: string[];
  scope: string;
  sub: string;
}
