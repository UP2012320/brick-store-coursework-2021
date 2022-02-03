import createFooter from 'Scripts/components/layout/footer';
import createNavbar from 'Scripts/components/layout/navbar';
import createRouter from 'Scripts/createRouter';
import {mergeDomTrees} from 'Scripts/diffing';
import createBrowse from 'Scripts/pages/browse';
import createMain from 'Scripts/pages/main';
import createProduct from 'Scripts/pages/product';
import {appendElements, createElement} from 'Scripts/uiUtils';
import {resetRefIndexes} from 'Scripts/useRef';
import {resetStateIndexes} from 'Scripts/useState';
import rootStyles from 'Styles/components/root.module.scss';
import type {productProps} from 'Types/types';

let currentRoot: HTMLElement;

const render = () => {
  console.debug('rendering');
  const root = document.querySelector('#root');

  if (!root) {
    console.error('Something has gone horribly wrong, where\'s #root!??');
    return;
  }

  const internalRoot = createElement('div', {
    id: rootStyles.root,
  });

  appendElements(internalRoot, createNavbar());

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
      appendElements(internalRoot, createBrowse());
      break;
    case 'product':
      appendElements(internalRoot, createProduct({qs} as productProps));
      break;
    case 'main':
      appendElements(internalRoot, createMain());
      break;
    default:
      appendElements(internalRoot, createNavbar());
      break;
  }

  appendElements(internalRoot, createFooter());

  if (currentRoot) {
    mergeDomTrees(internalRoot, currentRoot);
  } else {
    currentRoot = internalRoot;
    root.append(currentRoot);
  }
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
