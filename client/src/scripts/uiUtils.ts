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
  ...styles: string[]
) => {
  const newElement = createElement(type, options);
  newElement.classList.add(...styles);

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

export function registerLinkClickHandler (container: HTMLElement, path: string): void;
export function registerLinkClickHandler (container: HTMLAnchorElement): void;
export function registerLinkClickHandler (element: HTMLElement, path?: string) {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    if (path) {
      history.pushState({}, '', path);
    } else if (element instanceof HTMLAnchorElement) {
      history.pushState({}, '', element.href);
    }

    forceReRender();
  });
}
