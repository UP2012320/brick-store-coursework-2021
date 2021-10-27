import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import {createElement, createElementWithStyles} from 'Scripts/uiUtils';
import styles from 'Styles/navbar.module.scss';

export class NavbarMainElementItem extends Component<{title: string}> {
  protected _internalBuild(componentRoot: ComponentElement): Element {
    const container = createElementWithStyles('div', styles.navMainElementContainer);
    const title = createElement('h1', {
      textContent: this._props.title,
    });

    return componentRoot.down(container).then(title).end();
  }
}
