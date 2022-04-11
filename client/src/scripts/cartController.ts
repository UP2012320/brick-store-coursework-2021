import {runIfAuthenticated} from 'Scripts/auth0';
import {getItemFromSessionStorage, serverBaseUrl} from 'Scripts/helpers';
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
  const cartStorage = getItemFromSessionStorage<CartItem[]>('cart');

  let newCartItem: CartItem = {product, quantity};

  if (cartStorage) {
    const existingItem = cartStorage.find((item) => item.product.inventory_id === product.inventory_id);

    if (existingItem) {
      existingItem.quantity += quantity;
      newCartItem = existingItem;
    } else {
      cartStorage.push(newCartItem);
    }

    window.sessionStorage.setItem('cart', JSON.stringify(cartStorage));
  } else {
    window.sessionStorage.setItem('cart', JSON.stringify([newCartItem]));
  }

  return newCartItem;
};

const updateDatabase = async (cartItem: CartItem, userId: string) => {
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

  await runIfAuthenticated(async (userInfo) => {
    if (userInfo.sub) {
      await updateDatabase(cartItem, userInfo.sub);
    }
  });

  // The storage event only fires in other windows, so we have to fire it manually
  window.dispatchEvent(new Event('storage'));
};

const deleteFromSessionStorage = (inventoryId: string) => {
  let cartStorage = getItemFromSessionStorage<CartItem[]>('cart');

  if (cartStorage) {
    cartStorage = cartStorage.filter((cartItem) => cartItem.product.inventory_id !== inventoryId);
  }

  window.sessionStorage.setItem('cart', JSON.stringify(cartStorage));
};

const deleteFromDatabase = async (userId: string, inventoryId: string) => {
  const body = {inventoryId, userId};

  try {
    await fetch(new URL('/api/v1/deleteFromCart', serverBaseUrl).href, {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteFromCart = async (product: Product) => {
  deleteFromSessionStorage(product.inventory_id);

  await runIfAuthenticated(async (userInfo) => {
    if (userInfo.sub) {
      await deleteFromDatabase(userInfo.sub, product.inventory_id);
    }
  });

  window.dispatchEvent(new Event('storage'));
};

export const updateQuantity = async (inventoryId: string, quantity: number) => {
  const cartItems = getItemFromSessionStorage<CartItem[]>('cart');

  if (cartItems) {
    const targetCartItem = cartItems.find((cartItem) => cartItem.product.inventory_id === inventoryId);

    if (targetCartItem) {
      targetCartItem.quantity = quantity;

      window.sessionStorage.setItem('cart', JSON.stringify(cartItems));

      await runIfAuthenticated(async (userInfo) => {
        if (userInfo.sub) {
          await updateDatabase(targetCartItem, userInfo.sub);
        }
      });

      window.dispatchEvent(new Event('storage'));
    }
  }
};
