import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import cartStyles from './cart.module.scss';

export default function createCart () {
  const cartScrollContainer = createElementWithStyles('section', undefined, cartStyles.cartScrollContainer);
  const cartContainer = createElementWithStyles('div', undefined, cartStyles.cartContainer);
  const cart = createElementWithStyles('div', undefined, cartStyles.cartRow);

  return htmlx`
  <${cartScrollContainer}>
    <${cartContainer}>
      <${cart}>

      </cart>
    </cartContainer>
  </cartScrollContainer>
  `;
}
