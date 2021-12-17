import createNavbarItem from 'Scripts/components/layout/navbarItem';
import {createElement, createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import styles from 'Styles/navbar.module.scss';

export default function createNavbar () {
  const navbar = createElement('nav');
  const leftSideElement = createElementWithStyles(
    'div',
    undefined,
    styles.navSideElement,
  );
  const mainElement = createElementWithStyles(
    'div',
    undefined,
    styles.navMainElement,
  );

  const navbarBrowseItem = createNavbarItem({title: 'Browse'});
  const navbarBrowseItem2 = createNavbarItem({title: 'Browse'});
  const navbarBrowseItem3 = createNavbarItem({title: 'Browse'});

  const rightSideElement = createElementWithStyles(
    'div',
    undefined,
    styles.navSideElement,
  );

  const leftSideTitle = createElementWithStyles('a', {
    href: '/',
    textContent: 'The Super Brick Store',
  }, styles.storeTitle);

  registerLinkClickHandler(leftSideTitle);

  leftSideElement.append(leftSideTitle);

  mainElement.append(navbarBrowseItem, navbarBrowseItem2, navbarBrowseItem3);

  navbar.append(leftSideElement, mainElement, rightSideElement);

  return navbar;
}
