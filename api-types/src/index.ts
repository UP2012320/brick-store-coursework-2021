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
  date_added: string;
  description: string;
  discount?: number;
  discount_price: number;
  images?: string[];
  inventory_id: string;
  name: string;
  price: number;
  slug: string;
  stock: number;
  type: string;
  visibility: boolean;
}

export type NewProduct = Omit<Product, 'discount_price' | 'inventory_id' | 'slug'>;
export type UpdatedProduct = Omit<Product, 'discount_price' | 'slug'>;

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

export interface ApiResponse {
  error: string;
  message: string;
  statusCode: number;
}
