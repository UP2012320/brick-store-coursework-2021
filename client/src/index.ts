import {auth0, fetchAuth0Config} from 'Scripts/auth0';
import createFooter from 'Scripts/components/layout/footer';
import createNavbar from 'Scripts/components/layout/navbar';
import createProduct from 'Scripts/components/product/product';
import createRouter from 'Scripts/createRouter';
import {fireAfterRenderFunctions, resetUseAfterRenderStateIndexes} from 'Scripts/hooks/useAfterRender';
import {fireUseEffectQueue, resetUseEffectStateIndexes} from 'Scripts/hooks/useEffect';
import {resetRefIndexes} from 'Scripts/hooks/useRef';
import {resetStateIndexes} from 'Scripts/hooks/useState';
import withEvents from 'Scripts/morphdom-events';
import type {BrowseProps} from 'Scripts/pages/browse';
import createBrowse from 'Scripts/pages/browse';
import createCart from 'Scripts/pages/cart';
import createMain from 'Scripts/pages/main';
import {appendElements, createElement, forceReRender} from 'Scripts/uiUtils';
import rootStyles from 'Styles/components/root.module.scss';
import type {ProductProps} from 'Types/types';
import morphdom from 'morphdom';

let currentRoot: HTMLElement;

const render = async () => {
  console.debug('rendering');

  if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
    await auth0.handleRedirectCallback();

    history.pushState({}, document.title, '/');

    forceReRender();
  }

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
  console.debug(await auth0.isAuthenticated());
};

const main = async () => {
  await fetchAuth0Config();

  await render();

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  window.addEventListener('popstate', onPopState);
};

(async () => {
  await main();
})();
