import {Component} from 'Scripts/framework/component';
import {ComponentElement} from 'Scripts/framework/componentElement';
import {createElement} from 'Scripts/uiUtils';

export class Main extends Component {
  _build(): Element {
    const [clicks, setClicks] = this.createStore(0);
    const u = this.createRef(0);

    const onClick = () => {
      setClicks((prev) => prev + 1);

      if (clicks) {
        u.value = clicks * 2;
      }
    };

    if (!this._componentRoot) {
      this._componentRoot = new ComponentElement(createElement('div'));
    }

    const header = createElement('h1', {
      textContent: `You've clicked ${clicks ?? 0} times | ${
        clicks ?? 0
      } * 2 = ${u.value ?? 0}`,
    });

    const button = createElement('button', {
      textContent: 'Click me',
    });
    button.addEventListener('click', () =>
      this.registerCallback(() => onClick()),
    );

    return this._componentRoot.then(header).then(button).end();
  }
}
