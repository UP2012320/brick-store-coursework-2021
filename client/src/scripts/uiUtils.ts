export function createElement<K extends keyof HTMLElementTagNameMap>(
  type: K,
  options?: Partial<HTMLElementTagNameMap[K]>,
): HTMLElementTagNameMap[K] {
  const newElement = document.createElement(type) as HTMLElementTagNameMap[K];

  return Object.assign(newElement, options);
}

export function createElementWithStyles<K extends keyof HTMLElementTagNameMap>(type: K,
  options?: Partial<HTMLElementTagNameMap[K]>,
  ...styles: string[]) {
  const newElement = createElement(type, options);
  newElement.classList.add(...styles);

  return newElement;
}

export function createSvgElementFromFile(svg: string, options?: Partial<SVGSVGElement>, ...styles: string[]) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(svg, 'application/xml');

  const element = parsedDocument.documentElement;

  element.classList.add(...styles);

  return Object.assign(element, options) as SVGSVGElement;
}

export function appendAllNodes(parent: HTMLElement, nodes: HTMLElement[]) {
  nodes.forEach(node => {
    parent.appendChild(node);
  });
}

export function registerLinkClickHandler(element: HTMLElement, path: string) {
  element.addEventListener('click', () => {
    if (window.location.pathname === path) {
      return;
    }

    history.pushState({}, '', path);
    dispatchEvent(new Event('popstate'));
  });
}
