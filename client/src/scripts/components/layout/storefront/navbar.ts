import logo from 'Assets/drawing512.png';
import styles from 'Scripts/components/layout/storefront/navbar.module.scss';
import createNavbarMiddle from 'Scripts/components/layout/storefront/navbarMainContainerItem';
import createNavbarRightSide from 'Scripts/components/layout/storefront/navbarRightSide';
import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement, registerLinkClickHandler} from 'Scripts/uiUtils';

const key = nameof(createNavbar);

export default function createNavbar () {
  const navbar = createElement('nav');
  navbar.setAttribute('key', key);

  const leftSideContainer = createElement(
    'div',
    undefined,
    styles.navSideContainer,
  );

  const rightSide = createNavbarRightSide();

  const middle = createNavbarMiddle({title: 'Browse'});

  const leftSideContainerLogo = createElement('img', {
    alt: 'The Super Brick Store logo',
    src: logo,
  }, styles.navbarLogo);

  registerLinkClickHandler(leftSideContainerLogo, undefined, undefined, '/');

  return htmlx`
    <${navbar}>
      <${leftSideContainer}>
        <${leftSideContainerLogo}/>
      </leftSideElement>
      <${middle}/>
      <${rightSide}/>
    </navbar>
  `;
}
