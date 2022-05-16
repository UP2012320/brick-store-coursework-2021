const unloadCart = () => {
  localStorage.removeItem('cart');
};
const unload = () => {
  unloadCart();
};
export default unload;
