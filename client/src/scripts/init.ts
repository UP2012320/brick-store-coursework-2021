import {runIfAuthenticated} from 'Scripts/auth0';
import {getCart} from 'Scripts/cartController';
import {getItemFromSessionStorage} from 'Scripts/helpers';
import type {CartItem} from 'api-types';

const initCart = async (userId: string) => {
  const localCartItems = getItemFromSessionStorage<CartItem[]>('cart');

  if (localCartItems && localCartItems.length !== 0) {
    return;
  }

  const cartItems = await getCart(userId);

  window.sessionStorage.setItem('cart', JSON.stringify(cartItems));

  window.dispatchEvent(new Event('storage'));
};

const init = async () => {
  await runIfAuthenticated(async (userInfo) => {
    if (userInfo?.sub) {
      await initCart(userInfo.sub);
    }
  });
};

export default init;
