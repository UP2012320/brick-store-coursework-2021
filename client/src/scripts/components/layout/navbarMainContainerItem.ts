import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import styles from 'Styles/components/navbar.module.scss';

export default function createNavbarMainContainerItem (props: { title: string, }) {
  const container = createElementWithStyles(
    'div',
    undefined,
    styles.navMainContainerItem,
  );

  const browseIcon = createElementWithStyles('i', undefined, styles.biBag);

  const link = createElementWithStyles('a', {
    href: '/browse',
    textContent: props.title,
  }, styles.linkTitle);

  registerLinkClickHandler(container, '/browse');

  return htmlx`
    <${container}>
      <${browseIcon}/>
      <${link}/>
    </container>
  `;
}