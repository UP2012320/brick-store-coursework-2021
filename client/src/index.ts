import {fetchAuth0Config} from 'Scripts/auth0';
import createFooter from 'Scripts/components/layout/storefront/footer';
import createNavbar from 'Scripts/components/layout/storefront/navbar';
import createRouter from 'Scripts/createRouter';
import {clearUseEffect, fireUseEffectDiscardQueue, fireUseEffectQueue, resetUseEffectStateIndexes} from 'Scripts/hooks/useEffect';
import {clearRef, resetRefIndexes} from 'Scripts/hooks/useRef';
import {clearState, resetStateIndexes} from 'Scripts/hooks/useState';
import init from 'Scripts/init';
import withEvents from 'Scripts/morphdomEvents';
import type {BrowseProps} from 'Scripts/pages/browse';
import createBrowse from 'Scripts/pages/browse';
import createCart from 'Scripts/pages/cart/cart';
import createCheckout from 'Scripts/pages/checkout/checkout';
import createMain from 'Scripts/pages/main';
import createProduct from 'Scripts/pages/product/product';
import createStaff from 'Scripts/pages/staff/staff';
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
      name: 'staff',
      route: '/staff',
    },
    {
      name: 'main',
      route: '/',
    },
  ]);

  let body;

  switch (targetedRoute) {
    case 'browse':
      body = createBrowse(queryStrings as BrowseProps);
      break;
    case 'product':
      body = createProduct(restArgs as ProductProps);
      break;
    case 'cart':
      body = createCart();
      break;
    case 'checkout':
      body = createCheckout();
      break;
    case 'staff':
      body = createStaff();
      break;
    case 'main':
    default:
      body = createMain();
      break;
  }

  if (targetedRoute !== 'staff') {
    appendElements(internalRoot, createNavbar());
  }

  appendElements(internalRoot, body);

  if (targetedRoute !== 'staff') {
    appendElements(internalRoot, createFooter());
  }

  if (currentRoot) {
    morphdom(currentRoot, internalRoot, withEvents({
      onBeforeElUpdated: (fromElement, toElement) => {
        const fromKey = fromElement.getAttribute('key');
        const toKey = toElement.getAttribute('key');

        if (fromKey && fromKey !== toKey) {
          fireUseEffectDiscardQueue(fromKey);
          clearUseEffect(fromKey);
          clearState(fromKey);
          clearRef(fromKey);
        }

        return true;
      },
      onNodeDiscarded: (node) => {
        if (node instanceof HTMLElement) {
          const key = node.getAttribute('key');

          if (key) {
            fireUseEffectDiscardQueue(key);
            clearUseEffect(key);
            clearState(key);
            clearRef(key);
          }
        }
      },
    }));
    // mergeDomTrees(internalRoot, currentRoot);
  } else {
    currentRoot = internalRoot;
    root.append(currentRoot);
  }

  fireUseEffectQueue();
};

const onPopState = async () => {
  resetStateIndexes();
  resetRefIndexes();
  resetUseEffectStateIndexes();
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
