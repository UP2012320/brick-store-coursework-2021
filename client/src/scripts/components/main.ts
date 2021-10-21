import {Component} from 'Scripts/framework/component';
import {ComponentElement} from 'Scripts/framework/componentElement';
import {createElement} from 'Scripts/uiUtils';

export class Main extends Component {
  build(): Element {
    const [clicks, setClicks] = this.createStore(0);

    const onClick = () => {
      setClicks((prev) => prev + 1);
    };

    if (!this._componentRoot) {
      this._componentRoot = new ComponentElement(createElement('div'));
    }

    const header = createElement('h1', {
      textContent: `You've clicked ${clicks ?? 0} times`,
    });

    const button = createElement('button', {
      textContent: 'Click me',
    });
    button.addEventListener('click', () => onClick());

    return this._componentRoot.then(header).then(button).end();
  }
}
