export interface RouterArgs<T extends string> {
  name: T;
  route: string;
}

export interface productProps {
  qs?: {
    slug: string,
  };
}
