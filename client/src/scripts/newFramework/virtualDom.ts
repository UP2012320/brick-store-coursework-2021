import {ParsedElement} from 'Scripts/newFramework/parsedElement';

export default class VirtualDom {
  private _rootElement: ParsedElement;

  constructor(rootElement: ParsedElement) {
    this._rootElement = rootElement;
  }

  static render(element: ParsedElement, root: Element | null | undefined) {
    if (!root) {
      throw new Error('Root element was undefined');
    }

    const rootParsedElement = ParsedElement.fromElement(root);

    rootParsedElement.appendParsedElement(element);

    return new VirtualDom(rootParsedElement);
  }
}
