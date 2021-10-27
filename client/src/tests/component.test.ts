import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import {createElement} from 'Scripts/uiUtils';

class TestComponent extends Component {
  protected _build(componentRoot: ComponentElement): Element {
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

    return componentRoot
      .then(h1)
      .then(h2)
      .then(h3)
      .then(button)
      .then(reset)
      .then(negative)
      .end();
  }
}

let component: Component;

beforeEach(() => {
  component = new TestComponent({});
});

test('component builds successfully', () => {
  const build = component.build();

  expect(build).toBeTruthy();
  expect(build.querySelector('#h1')).toBeTruthy();
  expect(build.querySelector('#h2')).toBeTruthy();
  expect(build.querySelector('#button')).toBeTruthy();
});

test('component runs button click handler successfully', () => {
  const build = component.build();

  const h1 = build.querySelector('#h1');
  const h2 = build.querySelector('#h2');
  const button = build.querySelector('#button');

  expect(build).toBeTruthy();
  expect(h1).toBeTruthy();
  expect(h2).toBeTruthy();
  expect(button).toBeTruthy();

  if (button && h1 && h2) {
    button.dispatchEvent(new Event('click'));

    setTimeout(() => {
      expect(h1.textContent).toBe('You\'ve clicked 1 times');
      expect(h2.textContent).toBe('1 * 2 = 2');
    }, 10);
  }
});

test('component resets counter successfully', () => {
  const build = component.build();

  const h1 = build.querySelector('#h1');
  const h2 = build.querySelector('#h2');
  const button = build.querySelector('#button');
  const reset = build.querySelector('#reset');

  expect(build).toBeTruthy();
  expect(h1).toBeTruthy();
  expect(h2).toBeTruthy();
  expect(button).toBeTruthy();
  expect(reset).toBeTruthy();

  if (button && h1 && h2 && reset) {
    button.dispatchEvent(new Event('click'));

    setTimeout(() => {
      expect(h1.textContent).toBe('You\'ve clicked 1 times');
      expect(h2.textContent).toBe('1 * 2 = 2');
    }, 10);

    reset.dispatchEvent(new Event('click'));

    setTimeout(() => {
      expect(h1.textContent).toBe('You\'ve clicked 0 times');
      expect(h2.textContent).toBe('0 * 2 = 0');
    }, 10);
  }
});

test('component fixes negative multiplication', () => {
  const build = component.build();

  const h2 = build.querySelector('#h2');
  const negative = build.querySelector('#negative');

  expect(build).toBeTruthy();
  expect(h2).toBeTruthy();
  expect(negative).toBeTruthy();

  if (build && h2 && negative) {
    negative.dispatchEvent(new Event('click'));

    setTimeout(() => {
      expect(h2.textContent).toBe('0 * 2 = 0');
    }, 10);
  }
});

test('random number is set successfully', () => {
  const build = component.build();

  const h3 = build.querySelector('#h3');

  expect(build).toBeTruthy();
  expect(h3).toBeTruthy();

  if (build && h3) {
    expect(h3.textContent).toBe('6');
  }
});
