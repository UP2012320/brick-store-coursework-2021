import {Component} from 'Scripts/framework/component';
import {ComponentElement} from 'Scripts/framework/componentElement';

export class Main extends Component {
  _build(componentRoot: ComponentElement): Element {
    return componentRoot.end();
  }
}
