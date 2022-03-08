import {auth0} from 'Scripts/auth0';
import {getCart} from 'Scripts/cartController';
import type {CartItem} from 'api-types';

const initCart = async (userId: string) => {
  const cartStorage = window.sessionStorage.getItem('cart');

  if (cartStorage) {
    const localCartItems = JSON.parse(cartStorage) as CartItem[];

    if (localCartItems.length !== 0) {
      return;
    }
  }

  const cartItems = await getCart(userId);

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
