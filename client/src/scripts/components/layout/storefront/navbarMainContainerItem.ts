import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer, registerLinkClickHandler} from 'Scripts/uiUtils';
import styles from 'Styles/components/navbar.module.scss';

const key = nameof(createNavbarMiddle);

export default function createNavbarMiddle (props: { title: string, }) {
  const mainContainer = createKeyedContainer(
    'div',
    key,
    undefined,
    styles.navMainContainer,
  );

  const container = createElementWithStyles(
    'div',
    undefined,
    styles.navMainContainerItem,
  );
  container.setAttribute('key', nameof(createNavbarMiddle));

  const browseIcon = createElementWithStyles('i', undefined, styles.biBag);

  const link = createElementWithStyles('a', {
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
