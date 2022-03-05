import createFooter from 'Scripts/components/layout/footer';
import createNavbar from 'Scripts/components/layout/navbar';
import createProduct from 'Scripts/components/product/product';
import createRouter from 'Scripts/createRouter';
import {fireAfterRenderFunctions, resetUseAfterRenderStateIndexes} from 'Scripts/hooks/useAfterRender';
import {fireUseEffectQueue, resetUseEffectStateIndexes} from 'Scripts/hooks/useEffect';
import {resetRefIndexes} from 'Scripts/hooks/useRef';
import {resetStateIndexes} from 'Scripts/hooks/useState';
import type {BrowseProps} from 'Scripts/pages/browse';
import createBrowse from 'Scripts/pages/browse';
import createCart from 'Scripts/pages/cart';
import createMain from 'Scripts/pages/main';
import {appendElements, createElement} from 'Scripts/uiUtils';
import rootStyles from 'Styles/components/root.module.scss';
import type {ProductProps} from 'Types/types';
import morphdom from 'morphdom';

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

  const [targetedRoute, restArgs, queryStrings] = createRouter([
    {
      name: 'browse',
      route: '/browse',
    },
    {
      name: 'product',
      route: '/product/:slug',
    },
    {
      name: 'cart',
      route: '/cart',
    },
    {
      name: 'main',
      route: '/',
    },
  ]);

  console.debug(targetedRoute);

  switch (targetedRoute) {
    case 'browse':
      appendElements(internalRoot, createBrowse({queryStrings} as BrowseProps));
      break;
    case 'product':
      appendElements(internalRoot, createProduct({restArgs} as ProductProps));
      break;
    case 'cart':
      appendElements(internalRoot, createCart());
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
    morphdom(currentRoot, internalRoot);
    // mergeDomTrees(internalRoot, currentRoot);
  } else {
    currentRoot = internalRoot;
    root.append(currentRoot);
  }

  fireAfterRenderFunctions();
  fireUseEffectQueue();
};

const onPopState = () => {
  resetStateIndexes();
  resetRefIndexes();
  resetUseEffectStateIndexes();
  resetUseAfterRenderStateIndexes();
  render();
};

const main = () => {
  render();

  window.addEventListener('popstate', onPopState);
};

main();
