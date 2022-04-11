export interface RouterArgs<T extends string> {
  name: T;
  route: string;
}

export interface ProductProps {
  restArgs?: {
    slug: string,
  };
}

export interface Ref<T> {
  current: T;
}

export interface CallerState<T> {
  index: number;
  states: Record<number, T>;
}

export interface UseEffectCallerState<T> extends CallerState<T> {
  isFirstRender: boolean;
}

export type HtmlTagResultType = 'closing' | 'opening' | 'selfClosing' | 'unknown';

export interface HtmlTagResult {
  literalArgumentIndex: number;
  tagType: HtmlTagResultType;
}

export interface ReUsableComponentProps {
  key?: string;
}

export type HTMLXBody = Array<HTMLElement | SVGSVGElement | null | undefined> | HTMLElement | SVGSVGElement | null | undefined;

export interface HasBodyProps {
  body: HTMLXBody
}

export interface DropDownOption {
  name: string;
  value: string;
}

export interface MultiSelectDropDownOption extends DropDownOption {
  toggled: boolean;
}

export type Filters = 'colours' | 'types' | 'order';
