export interface RouterArgs<T extends string> {
  name: T;
  route: string;
}

export interface productProps {
  qs?: {
    slug: string,
  };
}

export interface Ref<T> {
  current: T;
}

export interface CallerState {
  index: number;
  states: Record<number, unknown>;
}

export type HtmlTagResultType = 'closing' | 'opening' | 'selfClosing' | 'unknown';

export interface HtmlTagResult {
  literalArgumentIndex: number;
  tagType: HtmlTagResultType;
}
