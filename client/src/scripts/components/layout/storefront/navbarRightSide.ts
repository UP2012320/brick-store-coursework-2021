import {auth0} from 'Scripts/auth0';
import createSidebar from 'Scripts/components/sidebar/sidebar';
import {getItemFromLocalStorage, nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import init from 'Scripts/init';
import {createElement, createElementWithStyles, createKeyedContainer, registerLinkClickHandler} from 'Scripts/uiUtils';
import unload from 'Scripts/unload';
import styles from 'Styles/components/navbar.module.scss';
import {type CartItem, type JWTPayload} from 'api-types';

const key = nameof(createNavbarRightSide);

export default function createNavbarRightSide () {
  const [cartSize, setCartSize] = useState(key, 0);
  const [isLoggedIn, setIsLoggedIn] = useState(key, false);
  const [isStaff, setIsStaff] = useState(key, false);
  const [sidebarToggled, setSidebarToggled] = useState(key, false);
  const [windowWidth, setWindowWidth] = useState(key, window.innerWidth);

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

  const onResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(key, () => {
    updateCartSize();
    checkIfLoggedIn();
    checkIfUserIsStaff();
    window.addEventListener('storage', updateCartSize);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('storage', updateCartSize);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const rightSideContainer = createKeyedContainer(
    'div',
    key,
    undefined,
    styles.navRightSideContainer,
  );

  const shoppingCartContainer = createElementWithStyles('button', undefined, styles.actionButtonNoBorder);

  const shoppingCart = createElementWithStyles('i', undefined, styles.biCart2);

  registerLinkClickHandler(shoppingCart, undefined, undefined, '/cart');

  const shoppingCartAmount = createElement('span', {
    textContent: cartSize === 0 ? '' : cartSize.toString(),
  });

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

  const myOrdersButton = createElementWithStyles('button', {
    textContent: isLoggedIn ? 'My Orders' : 'Find My Order',
  }, styles.actionButtonNoBorder);

  let loginButton;

  if (isLoggedIn) {
    loginButton = createElementWithStyles('button', {
      onclick: async () => {
        await logout();
      },
      textContent: 'Logout',
    }, styles.actionButtonNoBorder);
  } else {
    loginButton = createElementWithStyles('button', {
      onclick: async () => {
        await login();
      },
      textContent: 'Login',
    }, styles.actionButtonNoBorder);
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

  const hamburgerButton = createElementWithStyles('button', {
    onclick: () => setSidebarToggled(!sidebarToggled),
  }, styles.hamburgerMenu);

  const list = createElementWithStyles('i', undefined, styles.biList);

  const buttonContainer = createElementWithStyles('div', undefined, styles.buttonsContainer);

  const buttonsContainer = htmlx`
  <${buttonContainer}>
    <${staffButton}/>
    <${myOrdersButton}/>
    <${loginButton}/>
    <${shoppingCartContainer}>
      <${shoppingCart}>
        <${shoppingCartAmount}/>
      </shoppingCart>
    </shoppingCartContainer>
  </buttonContainer>
`;

  const sidebar = createSidebar({
    body: buttonsContainer,
    key: `${key}-sidebar`,
    setToggled: setSidebarToggled,
    toggled: sidebarToggled,
  });

  return htmlx`
  <${rightSideContainer}>
    <${hamburgerButton}>
      <${list}/>
    </hamburgerButton>
    <${windowWidth > 768 ? buttonsContainer : null}/>
    <${sidebar}/>
  </rightSideElement>
  `;
}
