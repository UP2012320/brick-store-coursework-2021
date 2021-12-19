import logo from 'Assets/drawing512.png';
import createNavbarMainContainerItem from 'Scripts/components/layout/navbarMainContainerItem';
import html from 'Scripts/htmlTemplate';
import {createElement, createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import styles from 'Styles/components/navbar.module.scss';

export default function createNavbar () {
  const navbar = createElement('nav');

  const leftSideContainer = createElementWithStyles(
    'div',
    undefined,
    styles.navSideContainer,
  );

  const mainContainer = createElementWithStyles(
    'div',
    undefined,
    styles.navMainContainer,
  );

  const rightSideContainer = createElementWithStyles(
    'div',
    undefined,
    styles.navRightSideContainer,
  );

  const shoppingCartContainer = createElementWithStyles('div', undefined, styles.cartContainer);

  const shoppingCart = createElementWithStyles('i', undefined, styles.biCart2);

  const shoppingCartAmount = createElement('p', {
    textContent: '4',
  });

  const navbarBrowseItem = createNavbarMainContainerItem({title: 'Browse'});

  const leftSideContainerLogo = createElementWithStyles('img', {
    src: logo,
  }, styles.navbarLogo);

  registerLinkClickHandler(leftSideContainerLogo, '/');

  return html`
    <${navbar}>
      <${leftSideContainer}>
        <${leftSideContainerLogo}/>
      </leftSideElement>
      <${mainContainer}>
        <${navbarBrowseItem}/>
      </mainElement>
      <${rightSideContainer}>
        <${shoppingCartContainer}>
          <${shoppingCart}/>
          <${shoppingCartAmount}/>
        </shoppingCartContainer>
      </rightSideElement>
    </navbar>
  `;
}
