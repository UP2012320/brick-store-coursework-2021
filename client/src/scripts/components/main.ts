import {Component} from 'Scripts/framework/component';
import {createElement} from 'Scripts/uiUtils';

export class Main extends Component {
  build(): Element {
    const [clicks, setClicks] = this.createStore(0);

    const onClick = () => {
      setClicks((prev) => prev + 1);
    };

    this._componentRoot = createElement('div');

    const e = createElement('h1', {
      textContent: `You've clicked ${clicks ?? 0} times`,
    });

    const c = createElement<'button'>('button', {
      textContent: 'Click me',
    });
    c.addEventListener('click', () => onClick());

    this._componentRoot.appendChild(e);
    this._componentRoot.appendChild(c);

    return this._componentRoot;
  }
}
