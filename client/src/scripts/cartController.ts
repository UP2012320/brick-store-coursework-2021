import {auth0} from 'Scripts/auth0';
import {serverBaseUrl} from 'Scripts/helpers';
import type {CartItem, Product} from 'api-types';

export const getCart = async (userId: string) => {
  const url = new URL('/api/v1/getCart', serverBaseUrl);
  url.searchParams.set('userId', userId);

  let cartResponse;

  try {
    cartResponse = await fetch(url.href);
  } catch (error) {
    console.error(error);
    return [];
  }

  return await cartResponse.json() as CartItem[];
};

const addToSessionStorage = (product: Product, quantity: number) => {
  const cartStorageJson = window.sessionStorage.getItem('cart');

  let cartItem: CartItem = {product, quantity};

  if (cartStorageJson) {
    const cartStorage = JSON.parse(cartStorageJson) as CartItem[];

    const existingItem = cartStorage.find((item) => item.product.inventory_id === product.inventory_id);

    if (existingItem) {
      existingItem.quantity += quantity;
      cartItem = existingItem;
    } else {
      cartStorage.push({product, quantity});
    }

    window.sessionStorage.setItem('cart', JSON.stringify(cartStorage));
  } else {
    const cartStorage = JSON.stringify([{product, quantity}]);

    window.sessionStorage.setItem('cart', cartStorage);
  }

  return cartItem;
};

const addToDatabase = async (cartItem: CartItem, userId: string) => {
  const url = new URL('/api/v1/updateCart', serverBaseUrl);
  const body = {
    inventoryId: cartItem.product.inventory_id,
    quantity: cartItem.quantity,
    userId,
  };

  let response;

  try {
    response = await fetch(url.href, {
      body: JSON.stringify(body),
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
    console.error(response.statusText);
  }
};

export const addToCart = async (product: Product, quantity = 1) => {
  const cartItem = addToSessionStorage(product, quantity);

  if (await auth0.isAuthenticated()) {
    const userInfo = await auth0.getUser();

    if (!userInfo?.sub) {
      console.error('Failed to get user info');
      return;
    }

    await addToDatabase(cartItem, userInfo.sub);
  }

  // The storage event only fires in other windows, so we have to fire it manually
  window.dispatchEvent(new Event('storage'));
};

export const deleteFromCart = async (product: Product) => {

}
