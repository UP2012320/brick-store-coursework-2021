import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import {createElement, createElementWithStyles, createSvgElementFromFile} from 'Scripts/uiUtils';
import styles from 'Styles/navbar.module.scss';
import bag from 'Assets/bag.svg';

export class NavbarMainElementItem extends Component<{title: string}> {
  protected _internalBuild(componentRoot: ComponentElement): Element {
    const container = createElementWithStyles('div', undefined, styles.navMainElementContainer);
    const svg = createSvgElementFromFile(bag);

    const link = createElement('h1', {
      textContent: this._props.title
    });

    this._registerElementAsLink(link, '/browse');

    return componentRoot.useMapping([{
      container,
      children: [
        svg,
        link
      ]
    }]).end();
  }
}
