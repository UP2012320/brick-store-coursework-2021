import {Main} from 'Scripts/components/main';
import {Component} from 'Scripts/framework/component';
import {ComponentElement} from 'Scripts/framework/componentElement';

export class Root extends Component {
  private readonly _rootId: string;

  constructor(rootId = '#root') {
    super();
    this._rootId = rootId;
  }

  _build(): Element {
    const id = document.querySelector(this._rootId);

    if (id) {
      this._componentRoot = new ComponentElement(id);
      const main = new Main().build();

      return this._componentRoot.then(main).end();
    }

    throw new Error('Root ID not found');
  }
}
