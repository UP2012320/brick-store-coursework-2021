import image from 'Assets/2412b.png';
import {deleteFromCart, updateQuantity} from 'Scripts/cartController';
import {formatPrice, getProductUrl, nameof} from 'Scripts/helpers';
import {useRef} from 'Scripts/hooks/useRef';
import htmlx from 'Scripts/htmlX';
import cartStyles from 'Scripts/pages/cart/cart.module.scss';
import {createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import {type ReUsableComponentProps} from 'Types/types';
import {type CartItem} from 'api-types';

export interface CartRowProps extends ReUsableComponentProps {
  cartItem: CartItem;
  outOfStock: boolean;
  stockOnHand?: number;
}

export default function createCartRow (props: CartRowProps) {
  props.key ??= nameof(createCartRow);

  const quantityDebounceTimeout = useRef<number | undefined>(props.key, undefined);

  const cartRow = createElementWithStyles('div', undefined, cartStyles.cartRow);
  cartRow.setAttribute('key', props.key);

  const cartImageContainer = createElementWithStyles('a', {href: getProductUrl(props.cartItem.product.slug)}, cartStyles.cartImgContainer);

  registerLinkClickHandler(cartImageContainer);

  const cartImage = createElementWithStyles('img', {src: image}, cartStyles.cartImg);
  const cartTitle = createElementWithStyles('a', {href: getProductUrl(props.cartItem.product.slug), textContent: props.cartItem.product.name}, cartStyles.cartTitle);

  registerLinkClickHandler(cartTitle);

  let outOfStock;

  if (props.outOfStock) {
    outOfStock = createElementWithStyles('p',
      {textContent: props.stockOnHand === 0 ? 'Sorry, this item is out of stock' : `Sorry, there is only ${props.stockOnHand} of this item available`},
      cartStyles.cartError);
  }

  const cartQuantityContainer = createElementWithStyles('div', undefined, cartStyles.cartQuantityContainer);
  const cartQuantity = createElementWithStyles('input', {
    defaultValue: props.cartItem.quantity.toString() ?? '1',
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

  const cartQuantityAdd = createElementWithStyles('button', {
    onclick: () => {
      if (quantityDebounceTimeout.current) {
        window.clearTimeout(quantityDebounceTimeout.current);
      }

      quantityDebounceTimeout.current = setTimeout(() => {
        const newQuantity = props.cartItem.quantity + 1;

        updateQuantity(props.cartItem.product.inventory_id, newQuantity);
      }, 100);
    },
  }, cartStyles.biPlus);

  const cartQuantityMinus = createElementWithStyles('button', {
    onclick: () => {
      if (quantityDebounceTimeout.current) {
        window.clearTimeout(quantityDebounceTimeout.current);
      }

      quantityDebounceTimeout.current = setTimeout(() => {
        const newQuantity = props.cartItem.quantity - 1;

        if (newQuantity === 0) {
          deleteFromCart(props.cartItem.product);
        } else {
          updateQuantity(props.cartItem.product.inventory_id, newQuantity);
        }
      }, 100);
    },
  }, cartStyles.biDash);

  const cartPriceContainer = createElementWithStyles('div', undefined, cartStyles.cartPriceContainer);
  const cartPrice = createElementWithStyles('p', {textContent: formatPrice(props.cartItem.product.price)}, cartStyles.cartPrice);
  const cartDeleteIconContainer = createElementWithStyles('div', undefined, cartStyles.cartDeleteIconContainer);

  const cartDeleteIcon = createElementWithStyles('i', {
    onclick: () => {
      deleteFromCart(props.cartItem.product);
    },
  }, cartStyles.biTrash);

  return htmlx`
  <${cartRow}>
    <${cartImageContainer}>
      <${cartImage}/>
    </cartImageContainer>
    <${cartTitle}/>
    <${outOfStock}/>
    <${cartQuantityContainer}>
       <${cartQuantityMinus}/>
       <${cartQuantity}/>
       <${cartQuantityAdd}/>
    </cartQuantityContainer>
    <${cartPriceContainer}>
      <${cartPrice}/>
    </cartPriceContainer>
    <${cartDeleteIconContainer}>
      <${cartDeleteIcon}/>
    </cartDeleteIconContainer>
  </cartRow>`;
}
