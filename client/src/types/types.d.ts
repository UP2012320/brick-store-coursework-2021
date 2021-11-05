export type Component = (props?: Record<string, unknown>) => Mapping;
export type InitMapping = Record<string, HTMLElement | (HTMLElement | InitComponentMapping)[] | string> | HTMLElement | Mapping;
export type InitComponentMapping = Record<string, Mapping | string> | HTMLElement | Mapping;
export type MergedMapping = InitMapping | InitComponentMapping;
export type Mapping = MergedMapping[];

declare global {
  interface Array<T> {
    skip(amount: number): Array<T>;
    skipLast(amount: number): Array<T>;
  }
}

type HtmlNode = {
  depth?: number,
  tag: string
}

type HtmlTag = {
  type: 'closing' | 'component',
} & HtmlNode;

type HtmlText = {
  type: 'text',
  value: string,
  valueIsArg?: boolean
} & HtmlNode;

type HtmlTagWithAttributes = {
  type: 'opening' | 'selfClosing',
  attributes: HtmlAttribute[]
} & HtmlNode;

type HtmlTags = HtmlTag | HtmlTagWithAttributes | HtmlText;

interface HtmlAttribute {
  key: string,
  value: unknown,
  valueIsArg?: boolean
}
