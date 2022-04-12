import createCartRow from 'Scripts/components/cartRow';
import {getItemFromSessionStorage, nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer, registerLinkClickHandler} from 'Scripts/uiUtils';
import type {CartItem} from 'api-types';
import cartStyles from './cart.module.scss';

export default function createCart () {
  const [cartItems, setCartItems] = useState<CartItem[]>(nameof(createCart), []);
  const [outOfStockItems, setOutOfStockItems] = useState<Array<{ inventoryId: string, stock: number, }>>(nameof(createCart), []);
  const history = window.history.state as Array<{ inventoryId: string, stock: number, }> | undefined;

  const getCartItems = () => {
    const cartItemss = getItemFromSessionStorage<CartItem[]>('cart');

    if (cartItemss) {
      setCartItems(cartItemss);
    }
  };

  const cartScrollContainer = createKeyedContainer('section', nameof(createCart), undefined, cartStyles.cartScrollContainer);

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
    if (history) {
      const outOfStock = history.find((item) => item.inventoryId === cartItem.product.inventory_id);

      if (outOfStock) {
        return createCartRow({cartItem, key: cartItem.product.inventory_id, outOfStock: true, stockOnHand: outOfStock.stock});
      } else {
        return createCartRow({cartItem, key: cartItem.product.inventory_id, outOfStock: false});
      }
    } else {
      return createCartRow({cartItem, key: cartItem.product.inventory_id, outOfStock: false});
    }
  })}/>
      <${checkoutRow}>
        <${checkoutButton}/>
      </checkoutRow>
    </cartContainer>
  </cartScrollContainer>
  `;
}
