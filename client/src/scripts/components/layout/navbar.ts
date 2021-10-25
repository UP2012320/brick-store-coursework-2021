import {Component} from 'Scripts/framework/component';
import {ComponentElement} from 'Scripts/framework/componentElement';
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

    return componentRoot
      .then(leftSideElement)
      .then(mainElement)
      .then(rightSideElement)
      .end();
  }
}
