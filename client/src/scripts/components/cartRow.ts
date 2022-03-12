import image from 'Assets/2412b.png';
import {formatPrice} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import cartStyles from 'Scripts/pages/cart/cart.module.scss';
import {createElementWithStyles} from 'Scripts/uiUtils';
import type {CartItem} from 'api-types';

export interface CartRowProps {
  cartItem: CartItem;
}

export default function createCartRow (props: CartRowProps) {
  const cartRow = createElementWithStyles('div', undefined, cartStyles.cartRow);
  const cartImageContainer = createElementWithStyles('div', undefined, cartStyles.cartImgContainer);
  const cartImage = createElementWithStyles('img', {src: image}, cartStyles.cartImg);
  const cartTitle = createElementWithStyles('h1', {textContent: props.cartItem.product.name}, cartStyles.cartTitle);
  const cartQuantityContainer = createElementWithStyles('div', undefined, cartStyles.cartQuantityContainer);
  const cartQuantity = createElementWithStyles('input', {defaultValue: props.cartItem.quantity.toString(), type: 'number'}, cartStyles.cartQuantity);
  const cartPriceContainer = createElementWithStyles('div', undefined, cartStyles.cartPriceContainer);
  const cartPrice = createElementWithStyles('p', {textContent: formatPrice(props.cartItem.product.price)}, cartStyles.cartPrice);
  const cartDeleteIconContainer = createElementWithStyles('div', undefined, cartStyles.cartDeleteIconContainer);
  const cartDeleteIcon = createElementWithStyles('i', undefined, cartStyles.biX);

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
