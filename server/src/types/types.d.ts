export interface SearchBody {
  colour?: number;
  in_stock?: boolean;
  limit?: number;
  page?: number;
  price?: {
    max?: number,
    min?: number,
  };
  query: string;
  type?: number;
}
