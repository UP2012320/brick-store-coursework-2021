import {fetchAuth0Config, getToken, runIfAuthenticated} from 'Scripts/auth0';
import createFooter from 'Scripts/components/layout/footer';
import createNavbar from 'Scripts/components/layout/navbar';
import createRouter from 'Scripts/createRouter';
import {SERVER_BASE} from 'Scripts/helpers';
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
      name: 'staff',
      route: '/staff',
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

  await runIfAuthenticated(async () => {
    await fetch(new URL('/api/v1/addProduct', SERVER_BASE).href, {
      headers: await getToken() as HeadersInit,
      method: 'POST',
    });
  });

  appendElements(internalRoot, createFooter());

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
