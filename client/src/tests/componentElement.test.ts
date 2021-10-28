import ComponentElement from 'Scripts/framework/componentElement';
import {createElement} from 'Scripts/uiUtils';
import Navbar from 'Scripts/components/layout/navbar';

test('building with single element', () => {
  const div = createElement('div');

  const element = new ComponentElement(div);

  const result = element.end();

  expect(result).toBe(div);
});

test('building with one child element', () => {
  const div1 = createElement('div');
  const div2 = createElement('div');

  const element = new ComponentElement(div1);

  const result = element.then(div2).end();

  expect(result).toBe(div1);
  expect(result.firstChild).toBe(div2);
});

test('building with down works', () => {
  const div1 = createElement('div');
  const div2 = createElement('div');
  const div3 = createElement('div');

  const element = new ComponentElement(div1);

  const result = element.down(div2).down(div3).end();

  expect(result.firstChild).toBe(div2);
  expect(result.firstChild?.firstChild).toBe(div3);
});

test('building with down and up works', () => {
  const div1 = createElement('div');
  const div2 = createElement('div');
  const div3 = createElement('div');
  const div4 = createElement('div');

  const element = new ComponentElement(div1);

  const result = element.down(div2).then(div3).up().then(div4).end();

  expect(result.firstChild?.firstChild).toBe(div3);
  expect(result.lastChild).toBe(div4);
});

test('passing an array to then works', () => {
  const div1 = createElement('div');
  const div2 = createElement('div');
  const div3 = createElement('div');

  const element = new ComponentElement(div1);

  const result = element.then([div2, div3]).end();

  expect(result.children.length).toBe(2);
});

test('clearing children works', () => {
  const div1 = createElement('div');
  const div2 = createElement('div');
  const div3 = createElement('div');
  const div4 = createElement('div');

  const element = new ComponentElement(div1);

  element.then(div2).down(div3).then(div4);

  element.clearChildren();

  const result = element.end();

  expect(result.hasChildNodes()).toBe(false);
});

test('using thenComponent', () => {
  const div1 = createElement('div');
  const div2 = createElement('div');
  const div3 = createElement('div');

  const element = new ComponentElement(div1);

  const navbar = new Navbar({});

  const result = element.then(div2).down(div3).thenComponent(navbar).end();

  expect(result.children[1].hasChildNodes()).toBeTruthy();
});

test('up won\'t fail when there is no parent', () => {
  const div = createElement('div');

  const element = new ComponentElement(div);

  const result = element.up().up().end();

  expect(result).toBeTruthy();
});

test('useMapping with elements works correctly', () => {
  const div = createElement('div');
  const div2 = createElement('div');
  const div3 = createElement('div');
  const div4 = createElement('div');
  const div5 = createElement('div');
  const div6 = createElement('div');

  const element = new ComponentElement(div);

  const result = element.useMapping([
    {
      div2,
      children: [
        div3,
        div4,
      ],
    },
    div5,
    div6,
  ]).end();

  expect(result.children.length).toBe(3);
  expect(result?.firstChild?.childNodes.length).toBe(2);
});
