import Component from 'Scripts/framework/component';
import {TestComponent} from 'Tests/testingVariables';

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
