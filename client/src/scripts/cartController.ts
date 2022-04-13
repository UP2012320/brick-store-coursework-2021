import {getItemFromLocalStorage} from 'Scripts/helpers';
import type {CartItem, Product} from 'api-types';

const addToLocalStorage = (product: Product, quantity: number) => {
  const cartStorage = getItemFromLocalStorage<CartItem[]>('cart');

  let newCartItem: CartItem = {product, quantity};

  if (cartStorage) {
    const existingItem = cartStorage.find((item) => item.product.inventory_id === product.inventory_id);

    if (existingItem) {
      existingItem.quantity += quantity;
      newCartItem = existingItem;
    } else {
      cartStorage.push(newCartItem);
    }

    window.localStorage.setItem('cart', JSON.stringify(cartStorage));
  } else {
    window.localStorage.setItem('cart', JSON.stringify([newCartItem]));
  }

  return newCartItem;
};

export const addToCart = async (product: Product, quantity = 1) => {
  addToLocalStorage(product, quantity);

  // The storage event only fires in other windows, so we have to fire it manually
  window.dispatchEvent(new Event('storage'));
};

const deleteFromLocalStorage = (inventoryId: string) => {
  let cartStorage = getItemFromLocalStorage<CartItem[]>('cart');

  if (cartStorage) {
    cartStorage = cartStorage.filter((cartItem) => cartItem.product.inventory_id !== inventoryId);
  }

  window.localStorage.setItem('cart', JSON.stringify(cartStorage));
};

export const deleteFromCart = (product: Product) => {
  deleteFromLocalStorage(product.inventory_id);

  window.dispatchEvent(new Event('storage'));
};

export const updateQuantity = (inventoryId: string, quantity: number) => {
  const cartItems = getItemFromLocalStorage<CartItem[]>('cart');

  if (cartItems) {
    const targetCartItem = cartItems.find((cartItem) => cartItem.product.inventory_id === inventoryId);

    if (targetCartItem) {
      targetCartItem.quantity = quantity;

      window.sessionStorage.setItem('cart', JSON.stringify(cartItems));

      window.dispatchEvent(new Event('storage'));
    }
  }
};

export const clearCart = () => {
  window.localStorage.removeItem('cart');

  window.dispatchEvent(new Event('storage'));
};
