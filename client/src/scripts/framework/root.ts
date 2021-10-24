import {Main} from 'Scripts/components/main';
import {Component} from 'Scripts/framework/component';
import {ComponentElement} from 'Scripts/framework/componentElement';

export class Root extends Component {
  private readonly _rootId: string;

  constructor(rootId = '#root') {
    super();
    this._rootId = rootId;
  }

  protected _setComponentRoot() {
    const id = document.querySelector(this._rootId);

    if (id) {
      return new ComponentElement(id);
    } else {
      throw new Error('Root ID not found');
    }
  }

  _build(componentRoot: ComponentElement): Element {
    const main = new Main().build();

    return componentRoot.then(main).end();
  }
}
