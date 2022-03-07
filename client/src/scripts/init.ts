import {auth0} from 'Scripts/auth0';
import {serverBaseUrl} from 'Scripts/helpers';
import type {CartItem} from 'api-types';

const initCart = async (userId: string) => {
  const cartStorage = window.sessionStorage.getItem('cart');

  if (cartStorage) {
    const localCartItems = JSON.parse(cartStorage) as CartItem[];

    if (localCartItems.length !== 0) {
      return;
    }
  }

  const url = new URL('/api/v1/getCart', serverBaseUrl);
  url.searchParams.set('userId', userId);

  let cartResponse;

  try {
    cartResponse = await fetch(url.href);
  } catch (error) {
    console.error(error);
    return;
  }

  const cartItems = await cartResponse.json();

  window.sessionStorage.setItem('cart', JSON.stringify(cartItems));

  window.dispatchEvent(new Event('storage'));
};

const init = async () => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (!isAuthenticated) {
    return;
  }

  const userInfo = await auth0.getUser();

  if (!userInfo?.sub) {
    return;
  }

  await initCart(userInfo.sub);
};

export default init;
