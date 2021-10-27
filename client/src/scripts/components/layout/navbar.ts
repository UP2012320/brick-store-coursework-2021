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

    const navbarBrowseItem = new NavbarMainElementItem({title: 'Browse'});

    const rightSideElement = createElementWithStyles('div', undefined, styles.navSideElement);

    const leftSideTitle = createElement('h1', {
      id: styles.title,
    });
    const titleHref = createElement('a', {
      href: '/',
      textContent: 'The Super Brick Store',
    });

    return componentRoot
      .down(leftSideElement)
      .down(leftSideTitle)
      .then(titleHref).up()
      .down(mainElement)
      .thenComponent(navbarBrowseItem).up()
      .then(rightSideElement)
      .end();
  }
}

