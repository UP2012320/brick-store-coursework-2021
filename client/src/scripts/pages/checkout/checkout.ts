import {clearCart} from 'Scripts/cartController';
import {getItemFromLocalStorage, nameof, SERVER_BASE} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer, historyPush} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/components/contentRoot.module.scss';
import {type CartItem} from 'api-types';
import checkoutStyles from './checkout.module.scss';

const key = nameof(createCheckout);

export default function createCheckout () {
  const [checkoutComplete, setCheckoutComplete] = useState(key, false);

  const container = createKeyedContainer('section', key, undefined, contentRootStyles.contentRoot);

  const contentContainer = createElementWithStyles('div', undefined, checkoutStyles.checkoutContentContainer);

  const checkingOut = createElementWithStyles('p', {
    textContent: checkoutComplete ? 'Checkout complete!' : 'Checking out...',
  }, checkoutStyles.checkoutText);

  const statusCircle = createElementWithStyles('i', undefined, checkoutComplete ? checkoutStyles.biCheck : checkoutStyles.biDashLg);

  const checkoutProcess = async () => {
    console.debug('Checking out');

    const cart = getItemFromLocalStorage<CartItem[]>('cart');

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
      console.error('Error checking out', error);
      return;
    }

    if (!response.ok) {
      const data = await response.json();
      historyPush(data, '/cart');
      return;
    }

    setTimeout(() => {
      setCheckoutComplete(true);

      setTimeout(() => {
        clearCart();
        historyPush(undefined, '/browse');
      }, 2_500);
    }, 1_000);
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
      <${statusCircle}/>
    </contentContainer>
  </container>
  `;
}
