import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import {createElement} from 'Scripts/uiUtils';

export class TestComponent extends Component {
  protected _setComponentRoot(): ComponentElement | undefined {
    return new ComponentElement(createElement('div'));
  }

  protected _internalBuild(componentRoot: ComponentElement): Element {
    const [counter, setCounter] = this._createStore(0);
    const multiplication = this._createRef(0);
    const randomNumber = this._createRef(0);

    this._registerEffect(() => {
      if (multiplication && counter) {
        multiplication.value = counter * 2;
      }
    }, [counter]);

    this._registerEffect(() => {
      if (multiplication.value && multiplication.value < 0) {
        multiplication.value = 0;
      }
    });

    this._registerEffect(() => {
      randomNumber.value = 6;
    }, []);

    const onClick = this._getStatefulCallback(() => {
      setCounter(prev => prev + 1);
    });

    const h1 = createElement('h1', {
      textContent: `You've clicked ${counter} times`,
      id: 'h1'
    });

    const h2 = createElement('h2', {
      textContent: `${counter} * 2 = ${multiplication.value}`,
      id: 'h2'
    });

    const h3 = createElement('h3', {
      textContent: randomNumber.value?.toString(),
      id: 'h3'
    });

    const button = createElement('button', {
      id: 'button'
    });
    button.addEventListener('click', () => onClick({}));

    const reset = createElement('button', {
      id: 'reset'
    });
    reset.addEventListener('click', () => {
      this._registerStatefulCallback(() => {
        setCounter(0);
      });
    });

    const negative = createElement('button', {
      id: 'negative'
    });
    negative.addEventListener('click', () => {
      multiplication.value = -1;
    });

    const component2 = this._componentInstances.createInstance(new TestComponent2({}), 'test2');

    return componentRoot.useMapping([
      h1,
      h2,
      h3,
      button,
      reset,
      negative,
      component2
    ]).end();
  }
}

export class TestComponent2 extends Component {
  protected _internalBuild(componentRoot: ComponentElement): Element {
    const div = createElement('div');

    return componentRoot.then(div).end();
  }
}
