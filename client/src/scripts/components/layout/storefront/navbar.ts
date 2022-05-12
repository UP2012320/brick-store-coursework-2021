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
import {type CartItem, type JWTPayload} from 'api-types';

const key = nameof(createNavbar);

export default function createNavbar () {
  const [cartSize, setCartSize] = useState(key, 0);
  const [isLoggedIn, setIsLoggedIn] = useState(key, false);
  const [isStaff, setIsStaff] = useState(key, false);

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

  const checkIfUserIsStaff = async () => {
    const user = await auth0.getTokenSilently();
    const token = JSON.parse(atob(user.split('.')[1])) as JWTPayload;
    setIsStaff(token.permissions.includes('access:management'));
  };

  useEffect(key, () => {
    updateCartSize();
    checkIfLoggedIn();
    checkIfUserIsStaff();
    window.addEventListener('storage', updateCartSize);

    return () => {
      window.removeEventListener('storage', updateCartSize);
    };
  }, []);

  const shoppingCartContainer = createElementWithStyles('button', undefined, styles.actionButtonNoBorder);

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
    console.debug('Logging in...');
    try {
      await auth0.loginWithPopup();
    } catch (error) {
      console.error(error);
      return;
    }

    await init();
    setIsLoggedIn(true);
    await checkIfUserIsStaff();
  };

  const logout = async () => {
    await auth0.logout({
      returnTo: window.location.origin,
    });

    unload();
    setIsLoggedIn(false);
  };

  let loginButton;

  if (isLoggedIn) {
    loginButton = createElementWithStyles('button', {textContent: 'Logout'}, styles.actionButtonNoBorder);
    loginButton.onclick = async () => {
      await logout();
    };
  } else {
    loginButton = createElementWithStyles('button', {textContent: 'Login'}, styles.actionButtonNoBorder);
    loginButton.onclick = async () => {
      await login();
    };
  }

  let staffButton;

  if (isStaff) {
    const staffButtonElement = createElementWithStyles('button', undefined, styles.actionButtonNoBorder);

    const staffLink = createElementWithStyles('a', {
      href: `${window.location.origin}/staff`,
      textContent: 'Staff',
    }, styles.aLink);

    registerLinkClickHandler(staffLink, undefined, undefined, '/staff');

    staffButton = htmlx`
    <${staffButtonElement}>
      <${staffLink}>
    </staffLink>
    `;
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
        <${staffButton}/>
        <${loginButton}/>
        <${shoppingCartContainer}>
          <${shoppingCart}>
            <${shoppingCartAmount}/>
          </shoppingCart>
        </shoppingCartContainer>
      </rightSideElement>
    </navbar>
  `;
}
