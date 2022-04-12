import {auth0} from 'Scripts/auth0';
import {getItemFromSessionStorage, nameof, SERVER_BASE} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer, historyPush} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/components/contentRoot.module.scss';
import type {CartItem} from 'api-types';
import checkoutStyles from './checkout.module.scss';

const key = nameof(createCheckout);

export default function createCheckout () {
  const [checkoutComplete, setCheckoutComplete] = useState(key, false);

  const container = createKeyedContainer('section', key, undefined, contentRootStyles.contentRoot);

  const contentContainer = createElementWithStyles('div', undefined, checkoutStyles.checkoutContentContainer);

  const checkingOut = createElementWithStyles('p', {
    textContent: 'Checking you out',
  }, checkoutStyles.checkoutText);

  const loadingCircle = createElementWithStyles('i', undefined, checkoutStyles.biDashLg);

  const checkoutProcess = async () => {
    console.debug('Checking out');
    if (await auth0.isAuthenticated()) {
      console.debug('User is authenticated');
      const userInfo = await auth0.getUser();

      console.debug('User info', userInfo);

      if (!userInfo?.sub) {
        console.error('User info is missing sub');
        return;
      }

      const url = new URL(`/api/v1/checkout/${userInfo.sub}`, SERVER_BASE);

      let response;

      try {
        response = await fetch(url.href);
      } catch (error) {
        console.error(error);
        return;
      }

      if (!response.ok) {
        const data = await response.json() as Array<{ inventoryId: string, stock: number, }>;
        console.error(response.statusText);
        historyPush(data, '/cart');
        return;
      }

      setTimeout(() => {
        setCheckoutComplete(true);
      }, 1_000);
    } else {
      const cart = getItemFromSessionStorage<CartItem[]>('cart');

      const url = new URL('/api/v1/checkout', SERVER_BASE);

      let response;

      try {
        response = await fetch(url.href, {
          body: JSON.stringify(cart),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        });
      } catch (error) {
        console.error(error);
        return;
      }

      if (!response.ok) {
        const data = await response.json() as Array<{ inventoryId: string, stock: number, }>;
        console.error(response.statusText);
        historyPush(data, '/cart');
        return;
      }

      setTimeout(() => {
        setCheckoutComplete(true);
      }, 1_000);
    }
  };

  useEffect(key, () => {
    setTimeout(() => {
      checkoutProcess();
    }, 1_500);
  }, []);

  return htmlx`
  <${container}>
    <${contentContainer}>
      <${checkingOut}/>
      <${loadingCircle}/>
    </contentContainer>
  </container>
  `;
}
