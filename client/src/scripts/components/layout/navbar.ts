import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import {createElement, createElementWithStyles} from 'Scripts/uiUtils';
import styles from 'Styles/navbar.module.scss';

export default class Navbar extends Component {
  protected _setComponentRoot(): ComponentElement {
    return new ComponentElement(createElement('nav'));
  }

  protected _build(componentRoot: ComponentElement): Element {
    const leftSideElement = createElementWithStyles('div', undefined, styles.navSideElement);
    const mainElement = createElementWithStyles('div', undefined, styles.navSideElement);
    const rightSideElement = createElementWithStyles('div', undefined, styles.navSideElement);
    const title = createElement('h1', {
      id: styles.title,
    });
    const titleHref = createElement('a', {
      href: '/',
      textContent: 'The Super Brick Store',
    });

    return componentRoot
      .down(leftSideElement)
      .down(title)
      .then(titleHref).up(2)
      .then(mainElement)
      .then(rightSideElement)
      .end();
  }
}
