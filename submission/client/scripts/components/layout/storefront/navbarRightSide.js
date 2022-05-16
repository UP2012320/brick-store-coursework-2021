import {auth0} from 'Scripts/auth0';
import styles from 'Scripts/components/layout/storefront/navbar.module.scss';
import createSidebar from 'Scripts/components/sidebar/sidebar';
import {getItemFromLocalStorage, nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer, registerLinkClickHandler} from 'Scripts/uiUtils';
import unload from 'Scripts/unload';

const key = nameof(createNavbarRightSide);
export default function createNavbarRightSide() {
  const [cartSize, setCartSize] = useState(key, 0);
  const [isLoggedIn, setIsLoggedIn] = useState(key, false);
  const [isStaff, setIsStaff] = useState(key, false);
  const [sidebarToggled, setSidebarToggled] = useState(key, false);
  const [windowWidth, setWindowWidth] = useState(key, window.innerWidth);
  const updateCartSize = () => {
    const cartStorage = getItemFromLocalStorage('cart');
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
    const token = JSON.parse(atob(user.split('.')[1]));
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
  const rightSideContainer = createKeyedContainer('div', key, undefined, styles.navRightSideContainer);
  const shoppingCartContainer = createElement('button', undefined, styles.actionButtonNoBorder);
  const shoppingCart = createElement('i', undefined, styles.biCart2);
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
  const myOrdersButton = createElement('button', undefined, styles.actionButtonNoBorder);
  const myOrderLink = createElement('a', {
    href: isLoggedIn ? '/orders' : '/find-order',
    textContent: isLoggedIn ? 'My Orders' : 'Find My Order',
  }, styles.aLink);
  let loginButton;
  if (isLoggedIn) {
    loginButton = createElement('button', {
      onclick: async () => {
        await logout();
      },
      textContent: 'Logout',
    }, styles.actionButtonNoBorder);
  } else {
    loginButton = createElement('button', {
      onclick: async () => {
        await login();
      },
      textContent: 'Login',
    }, styles.actionButtonNoBorder);
  }
  let staffButton;
  if (isStaff) {
    const staffButtonElement = createElement('button', undefined, styles.actionButtonNoBorder);
    const staffLink = createElement('a', {
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
  const hamburgerButton = createElement('button', {
    onclick: () => setSidebarToggled(!sidebarToggled),
  }, styles.hamburgerMenu);
  const list = createElement('i', undefined, styles.biList);
  const buttonContainer = createElement('div', undefined, styles.buttonsContainer);
  const buttonsContainer = htmlx`
  <${buttonContainer}>
    <${staffButton}/>
    <${myOrdersButton}>
      <${myOrderLink}/>
    </myOrdersButton>
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
    <${windowWidth > 1_024 ? buttonsContainer : null}/>
    <${sidebar}/>
  </rightSideElement>
  `;
}
