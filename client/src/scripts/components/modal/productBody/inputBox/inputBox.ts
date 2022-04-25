import {nameof} from 'Scripts/helpers';
import type {StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import type {ReUsableComponentProps} from 'Types/types';
import inputBoxStyles from './inputBox.module.scss';

interface InputBoxProps extends ReUsableComponentProps {
  classPrefix: string;
  inputPrefix?: string;
  label: string;
  placeholder?: string;
  setValue: StateSetter<string>;
  textarea?: boolean;
  type?: string;
  value: string;
}

export default function createInputBox (props: InputBoxProps) {
  props.key ??= nameof(createInputBox);

  const inputContainer = createKeyedContainer('div', props.key, undefined, inputBoxStyles[`${props.classPrefix}InputContainer`]);

  const label = createElementWithStyles('label', {
    htmlFor: props.key,
    textContent: props.label,
  }, inputBoxStyles.inputLabel);

  const inputFieldContainer = createElementWithStyles('div', undefined, inputBoxStyles.inputFieldContainer);

  let inputPrefix;

  if (props.inputPrefix) {
    inputPrefix = createElementWithStyles('div', {
      textContent: props.inputPrefix,
    }, inputBoxStyles.inputPrefix);
  }

  let input;

  if (props.textarea) {
    input = createElementWithStyles('textarea', {
      id: props.key,
      oninput: (event) => {
        if (event.target instanceof HTMLTextAreaElement) {
          props.setValue(event.target.value);
        }
      },
      placeholder: props.placeholder,
      value: props.value,
    }, inputBoxStyles.inputField, inputBoxStyles.noPrefix);
  } else {
    input = createElementWithStyles('input', {
      id: props.key,
      oninput: (event) => {
        if (event.target instanceof HTMLInputElement) {
          props.setValue(event.target.value);
        }
      },
      placeholder: props.placeholder,
      type: props.type,
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
