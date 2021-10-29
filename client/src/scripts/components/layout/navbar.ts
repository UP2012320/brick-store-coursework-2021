import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import {createElement, createElementWithStyles} from 'Scripts/uiUtils';
import styles from 'Styles/navbar.module.scss';
import {NavbarMainElementItem} from 'Scripts/components/layout/navbarMainElementItem';

export default class Navbar extends Component {
  protected _setComponentRoot(): ComponentElement {
    return new ComponentElement(createElement('nav'));
  }

  protected _internalBuild(componentRoot: ComponentElement): Element {
    const leftSideElement = createElementWithStyles('div', undefined, styles.navSideElement);
    const mainElement = createElementWithStyles('div', undefined, styles.navMainElement);

    const navbarBrowseItem = this._componentInstances.createInstance(new NavbarMainElementItem({title: 'Browse'}),
      'navbarBrowseItem');
    const navbarBrowseItem2 = this._componentInstances.createInstance(new NavbarMainElementItem({title: 'Browse'}),
      'navbarBrowseItem2');
    const navbarBrowseItem3 = this._componentInstances.createInstance(new NavbarMainElementItem({title: 'Browse'}),
      'navbarBrowseItem3');

    const rightSideElement = createElementWithStyles('div', undefined, styles.navSideElement);

    const leftSideTitle = createElement('h1', {
      textContent: 'The Super Brick Store',
    });

    this._registerElementAsLink(leftSideTitle, '/');

    return componentRoot.useMapping([
      {
        leftSideElement,
        children: [
          leftSideTitle,
        ],
      },
      {
        mainElement,
        children: [
          navbarBrowseItem,
          navbarBrowseItem2,
          navbarBrowseItem3,
        ],
      },
      {
        rightSideElement,
      },
    ]).end();
  }
}

