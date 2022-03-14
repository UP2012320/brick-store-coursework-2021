import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/components/contentRoot.module.scss';
import checkoutStyles from './checkout.module.scss';

export default function createCheckout () {
  const container = createElementWithStyles('section', undefined, contentRootStyles.contentRoot);

  const contentContainer = createElementWithStyles('div', undefined, checkoutStyles.checkoutContentContainer);

  const checkingOut = createElementWithStyles('p', {
    textContent: 'Checking you out',
  }, checkoutStyles.checkoutText);

  const loadingCircle = createElementWithStyles('i', undefined, checkoutStyles.biDashLg);

  return htmlx`
  <${container}>
    <${contentContainer}>
      <${checkingOut}/>
      <${loadingCircle}/>
    </contentContainer>
  </container>
  `;
}
