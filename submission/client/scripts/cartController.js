import {getItemFromLocalStorage} from 'Scripts/helpers';

const addToLocalStorage = (product, quantity) => {
  const cartStorage = getItemFromLocalStorage('cart');
  let newCartItem = {product, quantity};
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
export const addToCart = async (product, quantity = 1) => {
  addToLocalStorage(product, quantity);
  // The storage event only fires in other windows, so we have to fire it manually
  window.dispatchEvent(new Event('storage'));
};
const deleteFromLocalStorage = (inventoryId) => {
  let cartStorage = getItemFromLocalStorage('cart');
  if (cartStorage) {
    cartStorage = cartStorage.filter((cartItem) => cartItem.product.inventory_id !== inventoryId);
  }
  window.localStorage.setItem('cart', JSON.stringify(cartStorage));
};
export const deleteFromCart = (product) => {
  deleteFromLocalStorage(product.inventory_id);
  window.dispatchEvent(new Event('storage'));
};
export const updateQuantity = (inventoryId, quantity) => {
  const cartItems = getItemFromLocalStorage('cart');
  if (cartItems) {
    const targetCartItem = cartItems.find((cartItem) => cartItem.product.inventory_id === inventoryId);
    if (targetCartItem) {
      targetCartItem.quantity = quantity;
      window.localStorage.setItem('cart', JSON.stringify(cartItems));
      window.dispatchEvent(new Event('storage'));
    }
  }
};
export const clearCart = () => {
  window.localStorage.removeItem('cart');
  window.dispatchEvent(new Event('storage'));
};
