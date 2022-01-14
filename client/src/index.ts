import createFooter from 'Scripts/components/layout/footer';
import createNavbar from 'Scripts/components/layout/navbar';
import createRouter from 'Scripts/createRouter';
import createBrowse from 'Scripts/pages/browse';
import createMain from 'Scripts/pages/main';
import createNotFound from 'Scripts/pages/notFound';
import createProduct from 'Scripts/pages/product';
import {createElement} from 'Scripts/uiUtils';
import {resetRefIndexes} from 'Scripts/useRef';
import {resetStateIndexes} from 'Scripts/useState';
import rootStyles from 'Styles/components/root.module.scss';
import type {productProps} from 'Types/types';

// let currentRoot: HTMLElement;

const render = () => {
  console.debug('rendering');
  const root = document.querySelector('#root');

  if (!root) {
    console.error('Something has gone horribly wrong, where\'s #root!??');
    return;
  }

  while (root.firstChild) {
    root.firstChild.remove();
  }

  const internalRoot = createElement('div', {
    id: rootStyles.root,
  });

  internalRoot.append(createNavbar());

  const [targetedRoute, qs] = createRouter([
    {
      name: 'browse',
      route: '/browse',
    },
    {
      name: 'product',
      route: '/product/:slug',
    },
    {
      name: 'main',
      route: '/',
    },
  ]);

  switch (targetedRoute) {
    case 'browse':
      internalRoot.append(createBrowse());
      break;
    case 'product':
      internalRoot.append(createProduct({qs} as productProps));
      break;
    case 'main':
      internalRoot.append(createMain());
      break;
    default:
      internalRoot.append(createNotFound());
      break;
  }

  internalRoot.append(createFooter());

  /* const virtualDom = domToVirtualDom(internalRoot);
  console.debug(virtualDom);
  const dom = virtualDomToDom(document, virtualDom);
  console.debug(dom);*/

  /* if (currentRoot) {
    mergeDomTrees(internalRoot, currentRoot);
  } else {
    currentRoot = internalRoot;
    root.append(currentRoot);
  }*/

  root.append(internalRoot);
};

const onPopState = () => {
  resetStateIndexes();
  resetRefIndexes();
  render();
};

const main = () => {
  render();

  window.addEventListener('popstate', onPopState);
};

main();
