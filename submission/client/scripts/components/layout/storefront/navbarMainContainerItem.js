import styles from 'Scripts/components/layout/storefront/navbar.module.scss';
import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer, registerLinkClickHandler} from 'Scripts/uiUtils';

const key = nameof(createNavbarMiddle);
export default function createNavbarMiddle(props) {
  const mainContainer = createKeyedContainer('div', key, undefined, styles.navMainContainer);
  const container = createElement('div', undefined, styles.navMainContainerItem);
  container.setAttribute('key', nameof(createNavbarMiddle));
  const browseIcon = createElement('i', undefined, styles.biBag);
  const link = createElement('a', {
    href: '/browse',
    textContent: props.title,
  }, styles.linkTitle);
  registerLinkClickHandler(container, undefined, undefined, '/browse');
  return htmlx`
  <${mainContainer}>
    <${container}>
      <${browseIcon}/>
      <${link}/>
    </container>
  </mainContainer>
  `;
}
