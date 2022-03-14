import {fetchAuth0Config} from 'Scripts/auth0';
import createFooter from 'Scripts/components/layout/footer';
import createNavbar from 'Scripts/components/layout/navbar';
import createRouter from 'Scripts/createRouter';
import {fireAfterRenderFunctions, resetUseAfterRenderStateIndexes} from 'Scripts/hooks/useAfterRender';
import {fireUseEffectQueue, resetUseEffectStateIndexes} from 'Scripts/hooks/useEffect';
import {resetRefIndexes} from 'Scripts/hooks/useRef';
import {resetStateIndexes} from 'Scripts/hooks/useState';
import init from 'Scripts/init';
import withEvents from 'Scripts/morphdom-events';
import type {BrowseProps} from 'Scripts/pages/browse';
import createBrowse from 'Scripts/pages/browse';
import createCart from 'Scripts/pages/cart/cart';
import createCheckout from 'Scripts/pages/checkout/checkout';
import createMain from 'Scripts/pages/main';
import createProduct from 'Scripts/pages/product/product';
import {appendElements, createElement} from 'Scripts/uiUtils';
import rootStyles from 'Styles/components/root.module.scss';
import type {ProductProps} from 'Types/types';
import morphdom from 'morphdom';

let currentRoot: HTMLElement;

const render = async () => {
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
      name: 'checkout',
      route: '/checkout',
    },
    {
      name: 'main',
      route: '/',
    },
  ]);

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
    case 'checkout':
      appendElements(internalRoot, createCheckout());
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
    morphdom(currentRoot, internalRoot, withEvents({}));
    // mergeDomTrees(internalRoot, currentRoot);
  } else {
    currentRoot = internalRoot;
    root.append(currentRoot);
  }

  fireAfterRenderFunctions();
  fireUseEffectQueue();
};

const onPopState = async () => {
  resetStateIndexes();
  resetRefIndexes();
  resetUseEffectStateIndexes();
  resetUseAfterRenderStateIndexes();
  await render();
};

const main = async () => {
  await fetchAuth0Config();
  await init();

  window.onpopstate = async () => await onPopState();

  await render();
};

(async () => {
  await main();
})();
