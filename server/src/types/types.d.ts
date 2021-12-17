export interface SearchBody {
  colour?: number;
  has_discount?: boolean;
  in_stock?: boolean;
  page?: number;
  price?: {
    max?: number,
    min?: number,
  };
  query: string;
  size?: number;
  sort?: string;
  sortDirection?: string;
  type?: number;
}
