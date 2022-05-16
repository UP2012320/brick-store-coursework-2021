export const createElement = (type, options, ...styles) => {
  const newElement = document.createElement(type);
  const withOptions = Object.assign(newElement, options);
  for (const style of styles) {
    if (style) {
      withOptions.classList.add(style);
    }
  }
  return withOptions;
};
export const createKeyedContainer = (type, key, options, ...styles) => {
  const newElement = createElement(type, options, ...styles);
  newElement.setAttribute('key', key);
  return newElement;
};
export const createSvgElementFromFile = (svg, options, ...styles) => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(svg, 'application/xml');
  const element = parsedDocument.documentElement;
  element.classList.add(...styles);
  return Object.assign(element, options);
};
export const forceReRender = () => {
  dispatchEvent(new Event('popstate'));
};
export const preventHrefDefault = (href) => {
  href.addEventListener('click', (event) => {
    event.preventDefault();
  });
};

export function historyPush(data, path) {
  history.pushState(data, '', path);
  forceReRender();
}

export function registerLinkClickHandler(element, preClickCallback, data, path) {
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
export const appendElements = (parent, ...nodesOrDOMStrings) => {
  if (!parent) {
    return;
  }
  for (const node of nodesOrDOMStrings) {
    if (node) {
      parent.append(node);
    }
  }
};
