import {HtmlAttribute} from 'Types/types';

export class ParsedElement {
  parent?: ParsedElement;
  children: ParsedElement[] = [];
  attributes: HtmlAttribute[] = [];
  tag: string;
  text?: string;

  constructor(tag: string, attributes: HtmlAttribute[] = [], text?: string, parent?: ParsedElement) {
    this.tag = tag.toLowerCase();
    this.parent = parent;
    this.text = text;
    this.attributes = attributes;
  }

  static fromElement(element: Element) {
    const attributes: HtmlAttribute[] = [];

    for (let i = 0; i < element.attributes.length; i++) {
      const attribute = element.attributes[i];

      attributes.push({
        key: attribute.nodeName,
        value: attribute.nodeValue,
      });
    }

    return new ParsedElement(
      element.tagName,
      attributes,
      element.textContent ?? undefined,
    );
  }

  getSiblings() {
    return this.parent ? this.parent.children.filter(x => x !== this) : [];
  }

  appendChild(tag: string, attributes: HtmlAttribute[] = [], text?: string) {
    const newElement = new ParsedElement(tag, attributes, text, this);
    this.children.push(newElement);
    return newElement;
  }

  appendParsedElement(parsedElement: ParsedElement) {
    parsedElement.parent = this;
    this.children.push(parsedElement);
    return parsedElement;
  }
}
