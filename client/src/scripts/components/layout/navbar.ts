import logo from 'Assets/drawing512.png';
import {auth0} from 'Scripts/auth0';
import createNavbarMainContainerItem from 'Scripts/components/layout/navbarMainContainerItem';
import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import createCart from 'Scripts/pages/cart';
import {createElement, createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import styles from 'Styles/components/navbar.module.scss';
import type {SearchQueryResult} from 'api-types';

export default function createNavbar () {
  const [cartSize, setCartSize] = useState(nameof(createCart), 0);
  const [isLoggedIn, setIsLoggedIn] = useState(nameof(createCart), false);

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

  const updateCartSize = () => {
    const cartStorageString = window.sessionStorage.getItem('cart');

    if (cartStorageString) {
      const cartStorage = JSON.parse(cartStorageString) as SearchQueryResult[];

      if (cartStorage.length > 99) {
        setCartSize(99);
      } else {
        setCartSize(cartStorage.length);
      }
    } else {
      setCartSize(0);
    }
  };

  window.addEventListener('storage', updateCartSize);

  const checkIfLoggedIn = async () => {
    setIsLoggedIn(await auth0.isAuthenticated());
  };

  useEffect(nameof(createCart), () => {
    updateCartSize();
    checkIfLoggedIn();
  }, []);

  const shoppingCart = createElementWithStyles('i', undefined, styles.biCart2);

  registerLinkClickHandler(shoppingCart, '/cart');

  const shoppingCartAmount = createElement('span', {
    textContent: cartSize === 0 ? '' : cartSize.toString(),
  });

  const navbarBrowseItem = createNavbarMainContainerItem({title: 'Browse'});

  const leftSideContainerLogo = createElementWithStyles('img', {
    alt: 'The Super Brick Store logo',
    src: logo,
  }, styles.navbarLogo);

  registerLinkClickHandler(leftSideContainerLogo, '/');

  const login = async () => {
    try {
      await auth0.loginWithPopup();
    } catch (error) {
      console.error(error);
      return;
    }

    setIsLoggedIn(true);
  };

  const logout = async () => {
    await auth0.logout({
      returnTo: window.location.origin,
    });

    setIsLoggedIn(false);
  };

  let loginElement;

  if (isLoggedIn) {
    loginElement = createElement('p', {textContent: 'logged in'});
    loginElement.onclick = async () => {
      await logout();
    };
  } else {
    loginElement = createElement('p', {textContent: 'login here'});
    loginElement.onclick = async () => {
      await login();
    };
  }

  return htmlx`
    <${navbar}>
      <${leftSideContainer}>
        <${leftSideContainerLogo}/>
      </leftSideElement>
      <${mainContainer}>
        <${navbarBrowseItem}/>
      </mainElement>
      <${rightSideContainer}>
        <${loginElement}/>
        <${shoppingCart}>
          <${shoppingCartAmount}/>
        </shoppingCart>
      </rightSideElement>
    </navbar>
  `;
}
