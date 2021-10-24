import {Component} from 'Scripts/framework/component';
import {ComponentElement} from 'Scripts/framework/componentElement';
import {createElement} from 'Scripts/uiUtils';

export class Main extends Component {
  protected _setComponentRoot() {
    return new ComponentElement(createElement('div'));
  }

  _build(componentRoot: ComponentElement): Element {
    const [clicks, setClicks] = this.createStore(0);
    const u = this.createRef(1);

    const onClick = () => {
      setClicks((prev) => prev + 1);
    };

    this.registerEffect(() => {
      console.log('running');
      if (u.value) {
        u.value = u.value + 1;
      }
    }, [clicks]);

    const header = createElement('h1', {
      textContent: `You've clicked ${clicks} times | ${clicks} * 2 = ${
        u.value ?? 0
      }`,
    });

    const button = createElement('button', {
      textContent: 'Click me',
    });
    button.addEventListener('click', () =>
      this.registerCallback(() => onClick()),
    );

    return componentRoot.then(header).then(button).end();
  }
}
