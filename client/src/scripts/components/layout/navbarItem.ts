import bag from 'Assets/bag.svg';
import {createElementWithStyles, createSvgElementFromFile, registerLinkClickHandler} from 'Scripts/uiUtils';
import styles from 'Styles/components/navbar.module.scss';

export default function createNavbarItem (props: { title: string, }) {
  const container = createElementWithStyles(
    'div',
    undefined,
    styles.navMainElementContainer,
  );
  const svg = createSvgElementFromFile(bag);

  const link = createElementWithStyles('a', {
    href: '/browse',
    textContent: props.title,
  }, styles.linkTitle);

  registerLinkClickHandler(link);

  container.append(svg, link);

  return container;
}
