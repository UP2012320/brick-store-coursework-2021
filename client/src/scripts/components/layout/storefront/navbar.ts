import logo from 'Assets/drawing512.png';
import {auth0} from 'Scripts/auth0';
import createNavbarMainContainerItem from 'Scripts/components/layout/storefront/navbarMainContainerItem';
import {getItemFromLocalStorage, nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import init from 'Scripts/init';
import {createElement, createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import unload from 'Scripts/unload';
import styles from 'Styles/components/navbar.module.scss';
import type {CartItem} from 'api-types';

const key = nameof(createNavbar);

export default function createNavbar () {
  const [cartSize, setCartSize] = useState(key, 0);
  const [isLoggedIn, setIsLoggedIn] = useState(key, false);

  const navbar = createElement('nav');
  navbar.setAttribute('key', key);

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
    const cartStorage = getItemFromLocalStorage<CartItem[]>('cart');

    if (cartStorage) {
      const totalQuantity = cartStorage.reduce((a, b) => a + b.quantity, 0);

      if (totalQuantity > 99) {
        setCartSize(99);
      } else {
        setCartSize(totalQuantity);
      }
    } else {
      setCartSize(0);
    }
  };

  const checkIfLoggedIn = async () => {
    setIsLoggedIn(await auth0.isAuthenticated());
  };

  useEffect(key, () => {
    updateCartSize();
    checkIfLoggedIn();
    window.addEventListener('storage', updateCartSize);

    return () => {
      window.removeEventListener('storage', updateCartSize);
    };
  }, []);

  const shoppingCart = createElementWithStyles('i', undefined, styles.biCart2);

  registerLinkClickHandler(shoppingCart, undefined, undefined, '/cart');

  const shoppingCartAmount = createElement('span', {
    textContent: cartSize === 0 ? '' : cartSize.toString(),
  });

  const navbarBrowseItem = createNavbarMainContainerItem({title: 'Browse'});

  const leftSideContainerLogo = createElementWithStyles('img', {
    alt: 'The Super Brick Store logo',
    src: logo,
  }, styles.navbarLogo);

  registerLinkClickHandler(leftSideContainerLogo, undefined, undefined, '/');

  const login = async () => {
    try {
      await auth0.loginWithPopup();
    } catch (error) {
      console.error(error);
      return;
    }

    await init();
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await auth0.logout({
      returnTo: window.location.origin,
    });

    unload();
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
