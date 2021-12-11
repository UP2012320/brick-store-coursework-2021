import styles from 'Styles/navbar.module.scss';
import {
  createElement,
  createElementWithStyles,
  registerLinkClickHandler,
} from 'Scripts/uiUtils';
import createNavbarItem from 'Scripts/components/layout/navbarItem';

export default function createNavbar() {
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

  const navbarBrowseItem = createNavbarItem({ title: 'Browse' });
  const navbarBrowseItem2 = createNavbarItem({ title: 'Browse' });
  const navbarBrowseItem3 = createNavbarItem({ title: 'Browse' });

  const rightSideElement = createElementWithStyles(
    'div',
    undefined,
    styles.navSideElement,
  );

  const leftSideTitle = createElement('h1', {
    textContent: 'The Super Brick Store',
  });

  registerLinkClickHandler(leftSideElement, '/');

  leftSideElement.append(leftSideTitle);

  mainElement.append(navbarBrowseItem, navbarBrowseItem2, navbarBrowseItem3);

  navbar.append(leftSideElement, mainElement, rightSideElement);

  return navbar;
}
