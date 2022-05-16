import {type User} from '@auth0/auth0-spa-js';
import {auth0} from 'Scripts/auth0';
import {clearCart} from 'Scripts/cartController';
import createInputBox from 'Scripts/components/inputBox/inputBox';
import {getItemFromLocalStorage, nameof, SERVER_BASE} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer, historyPush} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/components/contentRoot.module.scss';
import {type CartItem} from 'api-types';
import checkoutStyles from './checkout.module.scss';

const key = nameof(createCheckout);

export default function createCheckout () {
  const [checkoutComplete, setCheckoutComplete] = useState(key, false);
  const [startCheckout, setStartCheckout] = useState(key, false);
  const [userInfo, setUserInfo] = useState<User | undefined>(key, undefined);
  const [email, setEmail] = useState(key, '');

  const container = createKeyedContainer('section', key, undefined, contentRootStyles.contentRoot);

  const contentContainer = createElement('div', undefined, checkoutStyles.checkoutContentContainer);

  let contentBody;

  if (userInfo || (startCheckout && email)) {
    const checkoutStatus = createElement('p', {
      textContent: checkoutComplete ? 'Checkout complete!' : 'Checking out...',
    }, checkoutStyles.checkoutText);

    const statusCircle = createElement('i', undefined, checkoutComplete ? checkoutStyles.biCheck : checkoutStyles.biDashLg);

    contentBody = htmlx`
    <${checkoutStatus}>
      <${statusCircle}/>
    </checkoutStatus>
    `;
  } else {
    const emailInput = createInputBox({
      key: 'checkoutEmailInput',
      label: 'Enter your email',
      placeholder: 'Enter your email',
      setValue: setEmail,
      type: 'email',
      value: email,
    });

    const emailSubmit = createElement('button', {
      onclick: () => {
        if (!email || !/^\S+@\S+\.\S+$/gmiu.test(email)) {
          return;
        }

        setStartCheckout(true);
      },
      textContent: 'Submit',
    }, checkoutStyles.actionButton);

    contentBody = htmlx`
    <${emailInput}>
      <${emailSubmit}/>
    </emailInput>
    `;
  }

  const checkoutProcess = async () => {
    const cart = getItemFromLocalStorage<CartItem[]>('cart');

    const url = new URL('/api/v1/checkout', SERVER_BASE);

    let response;

    try {
      response = await fetch(url.href, {
        body: JSON.stringify({
          cartItems: cart?.map((item) => ({
            inventoryId: item.product.inventory_id,
            quantity: item.quantity,
          })),
          email: userInfo?.email ?? email ?? '',
          userId: userInfo?.sub ?? '',
        }),
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

  const getInfo = async () => {
    const user = await auth0.getUser();
    setUserInfo(user);

    if (user) {
      setStartCheckout(true);
    }
  };

  useEffect(key, () => {
    getInfo();
  }, []);

  useEffect(key, () => {
    if (startCheckout) {
      setTimeout(() => {
        checkoutProcess();
      }, 1_500);
    }
  }, [startCheckout]);

  return htmlx`
  <${container}>
    <${contentContainer}>
      <${contentBody}/>
    </contentContainer>
  </container>
  `;
}
