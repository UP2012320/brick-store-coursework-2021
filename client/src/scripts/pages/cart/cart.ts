import createCartRow from 'Scripts/components/cartRow';
import {getItemFromSessionStorage, nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import type {CartItem} from 'api-types';
import cartStyles from './cart.module.scss';

export default function createCart () {
  const [cartItems, setCartItems] = useState<CartItem[]>(nameof(createCart), []);

  const getCartItems = () => {
    const cartItemss = getItemFromSessionStorage<CartItem[]>('cart');

    console.debug(cartItemss);

    if (cartItemss) {
      setCartItems(cartItemss);
    }
  };

  useEffect(nameof(createCart), () => {
    getCartItems();
  });

  window.addEventListener('storage', getCartItems);

  const cartScrollContainer = createElementWithStyles('section', undefined, cartStyles.cartScrollContainer);
  const cartContainer = createElementWithStyles('div', undefined, cartStyles.cartContainer);
  const headingRow = createElementWithStyles('div', undefined, cartStyles.cartRow);
  const quantityHeading = createElementWithStyles('p', {textContent: 'Quantity'}, cartStyles.cartQuantityHeader);
  const priceHeading = createElementWithStyles('p', {textContent: 'Price'}, cartStyles.cartPriceHeader);
  const removeHeading = createElementWithStyles('p', {textContent: 'Remove'}, cartStyles.cartRemoveHeader);

  const checkoutRow = createElementWithStyles('div', undefined, cartStyles.cartRow);
  const checkoutButton = createElementWithStyles('a', {
    href: '/checkout',
    textContent: 'Checkout',
  }, cartStyles.cartCheckoutButton);

  registerLinkClickHandler(checkoutButton);

  return htmlx`
  <${cartScrollContainer}>
    <${cartContainer}>
      <${headingRow}>
        <${quantityHeading}/>
        <${priceHeading}/>
        <${removeHeading}/>
      </headingRow>
      <${cartItems.map((cartItem) => createCartRow({cartItem}))}/>
      <${checkoutRow}>
        <${checkoutButton}/>
      </checkoutRow>
    </cartContainer>
  </cartScrollContainer>
  `;
}
