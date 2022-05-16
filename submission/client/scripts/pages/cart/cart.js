import createCartRow from 'Scripts/components/cartRow/cartRow';
import {formatPrice, getItemFromLocalStorage, nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer, registerLinkClickHandler} from 'Scripts/uiUtils';
import cartStyles from './cart.module.scss';

export default function createCart() {
  const [cartItems, setCartItems] = useState(nameof(createCart), []);
  const [outOfStockItems, setOutOfStockItems] = useState(nameof(createCart), []);
  const history = window.history.state;
  const getCartItems = () => {
    const cartItemss = getItemFromLocalStorage('cart');
    if (cartItemss) {
      setCartItems(cartItemss);
    }
  };
  const cartScrollContainer = createKeyedContainer('section',
    nameof(createCart),
    undefined,
    cartStyles.cartScrollContainer
  );
  const cartContainer = createElement('div', undefined, cartStyles.cartContainer);
  const headingRow = createElement('div', undefined, cartStyles.cartRow);
  const quantityHeading = createElement('p', {textContent: 'Quantity'}, cartStyles.cartQuantityHeader);
  const priceHeading = createElement('p', {textContent: 'Price'}, cartStyles.cartPriceHeader);
  const removeHeading = createElement('p', {textContent: 'Remove'}, cartStyles.cartRemoveHeader);
  const totalPrice = formatPrice(cartItems.reduce((current, item) => (item.product.price * item.quantity) + current,
    0
  ));
  const checkoutRow = createElement('div', undefined, cartStyles.cartRow);
  const cartPriceContainer = createElement('div', undefined, cartStyles.cartPriceContainer);
  const cartPrice = createElement('p', {textContent: totalPrice}, cartStyles.cartPrice);
  const checkoutButton = createElement('a', {
    href: '/checkout',
    textContent: 'Checkout',
  }, cartStyles.cartCheckoutButton);
  registerLinkClickHandler(checkoutButton);
  useEffect(nameof(createCart), () => {
    getCartItems();
    window.addEventListener('storage', getCartItems);
    return () => {
      window.removeEventListener('storage', getCartItems);
    };
  }, []);
  return htmlx`
  <${cartScrollContainer}>
    <${cartContainer}>
      <${headingRow}>
        <${quantityHeading}/>
        <${priceHeading}/>
        <${removeHeading}/>
      </headingRow>
      <${cartItems.map((cartItem) => {
    if (Array.isArray(history)) {
      const outOfStock = history.find((item) => item.inventoryId === cartItem.product.inventory_id);
      if (outOfStock) {
        return createCartRow({
          cartItem,
          key: cartItem.product.inventory_id,
          outOfStock: true,
          stockOnHand: outOfStock.stock
        });
      } else {
        return createCartRow({cartItem, key: cartItem.product.inventory_id, outOfStock: false});
      }
    } else {
      return createCartRow({cartItem, key: cartItem.product.inventory_id, outOfStock: false});
    }
  })}/>
      <${checkoutRow}>
        <${cartPriceContainer}>
          <${cartPrice}/>
        </cartPriceContainer>
        <${checkoutButton}/>
      </checkoutRow>
    </cartContainer>
  </cartScrollContainer>
  `;
}
