import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import styles from 'Styles/main.module.scss';
import {createElement} from 'Scripts/uiUtils';

export default class Main extends Component {
  protected _setComponentRoot(): ComponentElement {
    return new ComponentElement(createElement('div', {
      id: styles.main
    }));
  }

  _build(componentRoot: ComponentElement): Element {
    return componentRoot.end();
  }
}
