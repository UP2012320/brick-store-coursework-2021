import {auth0, fetchAuth0Config, getAuthorizationHeader} from 'Scripts/auth0';
import createNavbar from 'Scripts/components/layout/storefront/navbar';
import createRouter from 'Scripts/createRouter';
import {SERVER_BASE} from 'Scripts/helpers';
import {clearUseEffect, fireUseEffectDiscardQueue, fireUseEffectQueue, resetUseEffectStateIndexes} from 'Scripts/hooks/useEffect';
import {clearRef, resetRefIndexes} from 'Scripts/hooks/useRef';
import {clearState, resetStateIndexes} from 'Scripts/hooks/useState';
import withEvents from 'Scripts/morphdomEvents';
import createBrowse, {type BrowseProps} from 'Scripts/pages/browse';
import createCart from 'Scripts/pages/cart/cart';
import createCheckout from 'Scripts/pages/checkout/checkout';
import createMain from 'Scripts/pages/main';
import createNotFound from 'Scripts/pages/notFound';
import createOrders from 'Scripts/pages/orders/orders';
import createProduct from 'Scripts/pages/product/product';
import createProtectedPage from 'Scripts/pages/protectedPage/protectedPage';
import createStaff from 'Scripts/pages/staff/staff';
import {appendElements, createElement} from 'Scripts/uiUtils';
import rootStyles from 'Styles/components/root.module.scss';
import {type ProductProps} from 'Types/types';
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
      route: '/staff/*',
    },
    {
      name: 'orders',
      route: '/orders',
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
      body = createProduct({restArgs} as ProductProps);
      break;
    case 'cart':
      body = createCart();
      break;
    case 'checkout':
      body = createCheckout();
      break;
    case 'staff':
      body = createProtectedPage({
        body: createStaff(),
        checkIfAuthorized: async () => {
          const authorizationHeader = await getAuthorizationHeader();

          if (!authorizationHeader) {
            return '401';
          }

          let response;

          try {
            response = await fetch(new URL('/api/v1/staff/authorized', SERVER_BASE).href, {
              headers: authorizationHeader,
            });
          } catch (error) {
            console.error(error);
            return '500';
          }

          return response.status.toString();
        },
        key: 'staff-protected-page',
      });
      break;
    case 'orders':
      body = createProtectedPage({
        body: createOrders(),
        checkIfAuthorized: async () => (await auth0.isAuthenticated() ? '200' : '401'),
      });
      break;
    case 'main':
      body = createMain();
      break;
    default:
      body = createNotFound();
      break;
  }

  if (targetedRoute !== 'staff') {
    appendElements(internalRoot, createNavbar());
  }

  appendElements(internalRoot, body);

  if (currentRoot) {
    // Using these hooks, I can ensure that a component's state is reset when it is unmounted.
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

  window.onpopstate = async () => await onPopState();

  await render();
};

(async () => {
  await main();
})();
