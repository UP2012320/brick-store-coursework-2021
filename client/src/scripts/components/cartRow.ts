import image from 'Assets/2412b.png';
import {deleteFromCart, updateQuantity} from 'Scripts/cartController';
import {formatPrice, getProductUrl, nameof} from 'Scripts/helpers';
import {useRef} from 'Scripts/hooks/useRef';
import htmlx from 'Scripts/htmlX';
import cartStyles from 'Scripts/pages/cart/cart.module.scss';
import {createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import type {CartItem} from 'api-types';

export interface CartRowProps {
  cartItem: CartItem;
}

export default function createCartRow (props: CartRowProps) {
  const quantityDebounceTimeout = useRef<NodeJS.Timeout | undefined>(nameof(createCartRow), undefined);

  const cartRow = createElementWithStyles('div', undefined, cartStyles.cartRow);
  const cartImageContainer = createElementWithStyles('a', {href: getProductUrl(props.cartItem.product.slug)}, cartStyles.cartImgContainer);

  registerLinkClickHandler(cartImageContainer);

  const cartImage = createElementWithStyles('img', {src: image}, cartStyles.cartImg);
  const cartTitle = createElementWithStyles('a', {href: getProductUrl(props.cartItem.product.slug), textContent: props.cartItem.product.name}, cartStyles.cartTitle);

  registerLinkClickHandler(cartTitle);

  const cartQuantityContainer = createElementWithStyles('div', undefined, cartStyles.cartQuantityContainer);
  const cartQuantity = createElementWithStyles('input', {
    defaultValue: props.cartItem.quantity.toString(),
    min: '0',
    onchange: (event) => {
      const target = event.target as HTMLInputElement;

      if (quantityDebounceTimeout.current) {
        window.clearTimeout(quantityDebounceTimeout.current);
      }

      quantityDebounceTimeout.current = setTimeout(() => {
        if (target.value === '0') {
          deleteFromCart(props.cartItem.product);
        } else {
          updateQuantity(props.cartItem.product.inventory_id, Number.parseInt(target.value, 10));
        }
      }, 500);
    },
    type: 'number',
  }, cartStyles.cartQuantity);

  const cartPriceContainer = createElementWithStyles('div', undefined, cartStyles.cartPriceContainer);
  const cartPrice = createElementWithStyles('p', {textContent: formatPrice(props.cartItem.product.price)}, cartStyles.cartPrice);
  const cartDeleteIconContainer = createElementWithStyles('div', undefined, cartStyles.cartDeleteIconContainer);

  const cartDeleteIcon = createElementWithStyles('i', {
    onclick: async () => {
      await deleteFromCart(props.cartItem.product);
    },
  }, cartStyles.biX);

  return htmlx`
  <${cartRow}>
    <${cartImageContainer}>
      <${cartImage}/>
    </cartImageContainer>
    <${cartTitle}/>
    <${cartQuantityContainer}>
       <${cartQuantity}/>
    </cartQuantityContainer>
    <${cartPriceContainer}>
      <${cartPrice}/>
    </cartPriceContainer>
    <${cartDeleteIconContainer}>
      <${cartDeleteIcon}/>
    </cartDeleteIconContainer>
  </cartRow>`;
}
