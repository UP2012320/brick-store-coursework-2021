import {
  createElement,
  createElementWithStyles,
  createSvgElementFromFile,
  registerLinkClickHandler,
} from 'Scripts/uiUtils';
import styles from 'Styles/navbar.module.scss';
import bag from 'Assets/bag.svg';

export default function createNavbarItem(props: { title: string }) {
  const container = createElementWithStyles(
    'div',
    undefined,
    styles.navMainElementContainer,
  );
  const svg = createSvgElementFromFile(bag);

  const link = createElement('h1', {
    textContent: props.title,
  });

  registerLinkClickHandler(link, '/browse');

  container.append(svg, link);

  return container;
}
