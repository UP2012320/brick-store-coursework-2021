const unloadCart = () => {
  sessionStorage.removeItem('cart');
};

const unload = () => {
  unloadCart();
};

export default unload;
