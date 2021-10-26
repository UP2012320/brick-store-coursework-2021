import ComponentElement from 'Scripts/framework/componentElement';
import {createElement} from 'Scripts/uiUtils';

test('building with single element', () => {
  const div = createElement('div');

  const element = new ComponentElement(div);

  expect(element.end()).toBe(div);
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

  const result = element.down(div2).then(div3).end();

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

  const element = new ComponentElement(div1);

  const result = element.then(div2);

  result.clearChildren();

  const end = element.end();

  expect(end.hasChildNodes()).toBe(false);
});
