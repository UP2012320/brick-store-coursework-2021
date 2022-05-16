import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import checkboxStyles from './checkbox.module.scss';

export default function createCheckbox(props) {
  props.key ??= nameof(createCheckbox);
  const container = createKeyedContainer('div',
    props.key,
    undefined,
    checkboxStyles[`${props.class}CheckboxContainer`]
  );
  const input = createElement('input', {
    checked: props.value,
    id: props.key,
    onchange: (event) => {
      if (event.target instanceof HTMLInputElement) {
        props.setValue(event.target.checked);
      }
    },
    type: 'checkbox',
  });
  const label = createElement('label', {
    htmlFor: props.key,
    textContent: props.label,
  });
  return htmlx`
  <${container}>
    <${input}/>
    <${label}/>
  </${container}>
  `;
}
