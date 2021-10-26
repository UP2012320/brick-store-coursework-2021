const uiUtils = require('client/src/scripts/uiUtils')

test('createElement creates elements successfully', () => {
  const element = uiUtils.createElement('p', {
    textContent: 'Hello World!',
    id: 'text'
  });

  expect(element.tagName).toBe('P');
  expect(element.textContent).toBe('Hello World!');
  expect(element.id).toBe('text');
});

test('createElement create elements with tag specific properties available', () => {
  const canvas = uiUtils.createElement('canvas');

  expect(canvas.width).toBeTruthy();
});

test('createElementWithStyle adds styles to element', () => {
  const element = uiUtils.createElementWithStyles('p', undefined, 'red');

  expect(element.classList).toContain('red');
});

test('createElementWithStyle adds styles to element and options', () => {
  const element = uiUtils.createElementWithStyles('p', {id: 'text'}, 'red');

  expect(element.classList).toContain('red');
  expect(element.id).toBe('text');
});
