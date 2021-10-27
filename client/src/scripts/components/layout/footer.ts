import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import 'Styles/footer.scss';
import {createElement} from 'Scripts/uiUtils';

export default class Footer extends Component {
  protected _setComponentRoot(): ComponentElement {
    return new ComponentElement(createElement('footer'));
  }

  protected _internalBuild(componentRoot: ComponentElement): Element {
    return componentRoot.end();
  }
}
