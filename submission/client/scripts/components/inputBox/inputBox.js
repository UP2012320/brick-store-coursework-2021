import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import inputBoxStyles from './inputBox.module.scss';

export default function createInputBox(props) {
  props.key ??= nameof(createInputBox);
  const inputContainer = createKeyedContainer('div',
    props.key,
    undefined,
    props.classPrefix ? inputBoxStyles[`${props.classPrefix}InputContainer`] : inputBoxStyles.inputContainer
  );
  const label = createElement('label', {
    htmlFor: props.key,
    textContent: props.label,
  }, inputBoxStyles.inputLabel);
  const inputFieldContainer = createElement('div', undefined, inputBoxStyles.inputFieldContainer);
  let inputPrefix;
  if (props.inputPrefix) {
    inputPrefix = createElement('div', {
      textContent: props.inputPrefix,
    }, inputBoxStyles.inputPrefix);
  }
  let input;
  if (props.textarea) {
    input = createElement('textarea', {
      id: props.key,
      maxLength: 2_500,
      oninput: (event) => {
        if (event.target instanceof HTMLTextAreaElement) {
          props.setValue(event.target.value);
        }
      },
      placeholder: props.placeholder,
      value: props.value,
    }, inputBoxStyles.inputField, inputBoxStyles.noPrefix);
  } else {
    input = createElement('input', {
      id: props.key,
      oninput: (event) => {
        if (event.target instanceof HTMLInputElement) {
          props.setValue(event.target.value);
        }
      },
      placeholder: props.placeholder,
      type: props.type ?? 'text',
      value: props.value,
    }, inputBoxStyles.inputField, props.inputPrefix ? undefined : inputBoxStyles.noPrefix);
  }
  return htmlx`
  <${inputContainer}>
    <${label}/>
    <${inputFieldContainer}>
      <${inputPrefix}/>
      <${input}/>
    </inputFieldContainer>
  </nameInputContainer>
  `;
}
