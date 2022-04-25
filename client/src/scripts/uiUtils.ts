export const createElement = <K extends keyof HTMLElementTagNameMap> (
  type: K,
  options?: Partial<HTMLElementTagNameMap[K]>,
): HTMLElementTagNameMap[K] => {
  const newElement = document.createElement(type) as HTMLElementTagNameMap[K];

  return Object.assign(newElement, options);
};

export const createElementWithStyles = <K extends keyof HTMLElementTagNameMap> (
  type: K,
  options?: Partial<HTMLElementTagNameMap[K]>,
  ...styles: Array<string | null | undefined>
) => {
  const newElement = createElement(type, options);

  for (const style of styles) {
    if (style) {
      newElement.classList.add(style);
    }
  }

  return newElement;
};

export const createKeyedContainer = <K extends keyof HTMLElementTagNameMap> (
  type: K,
  key: string,
  options?: Partial<HTMLElementTagNameMap[K]>,
  ...styles: string[]
) => {
  const newElement = createElementWithStyles(type, options, ...styles);
  newElement.setAttribute('key', key);

  return newElement;
};

export const createSvgElementFromFile = (
  svg: string,
  options?: Partial<SVGSVGElement>,
  ...styles: string[]
) => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(svg, 'application/xml');

  const element = parsedDocument.documentElement;

  element.classList.add(...styles);

  return Object.assign(element, options) as SVGSVGElement;
};

export const forceReRender = () => {
  dispatchEvent(new Event('popstate'));
};

export const preventHrefDefault = (href: HTMLAnchorElement) => {
  href.addEventListener('click', (event) => {
    event.preventDefault();
  });
};

export function historyPush (data?: unknown, path?: string) {
  history.pushState(data, '', path);

  forceReRender();
}

export function registerLinkClickHandler (container: HTMLElement, preClickCallback?: () => Promise<boolean>, data?: unknown, path?: string): void;
export function registerLinkClickHandler (container: HTMLAnchorElement, preClickCallback?: () => Promise<boolean>, data?: unknown): void;
export function registerLinkClickHandler (element: HTMLElement, preClickCallback?: () => Promise<boolean>, data?: unknown, path?: string) {
  // eslint-disable-next-line
  element.addEventListener('click', async (event) => {
    event.preventDefault();

    if (preClickCallback && !await preClickCallback()) {
      return;
    }

    if (path) {
      historyPush(data, path);
    } else if (element instanceof HTMLAnchorElement) {
      historyPush(data, element.href);
    }
  });
}

/*
I implemented this appending function to allow htmlx to take null values. This way I can use conditionals
such as toggle ? <someElement/> : null, returning null meaning the component shouldn't be rendered at all.
The normal append or appendChild functions do not allow for null or undefined arguments.
 */
export const appendElements = (parent?: Element | HTMLElement | SVGSVGElement | null, ...nodesOrDOMStrings: Array<Node | string | null | undefined>) => {
  if (!parent) {
    return;
  }

  for (const node of nodesOrDOMStrings) {
    if (node) {
      parent.append(node);
    }
  }
};
