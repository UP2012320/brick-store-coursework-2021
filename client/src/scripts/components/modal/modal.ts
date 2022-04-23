import {nameof} from 'Scripts/helpers';
import type {StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import type {HasBodyProps, ReUsableComponentProps} from 'Types/types';
import modalStyles from './modal.module.scss';

interface ModalProps extends ReUsableComponentProps, HasBodyProps {
  isOpen: boolean;
  setIsOpen: StateSetter<boolean>;
}

export default function createModal (props: ModalProps) {
  props.key ??= nameof(createModal);

  const container = createKeyedContainer('div', props.key, {
    onmousedown: (event) => {
      event.stopPropagation();
    },
  }, modalStyles.container);

  const controlContainer = createElementWithStyles('div', undefined, modalStyles.controlContainer);

  const closeButton = createElementWithStyles('i', {
    onclick: () => props.setIsOpen(false),
  }, modalStyles.biX);

  const bodyContainer = createElementWithStyles('div', undefined, modalStyles.bodyContainer);

  const overlay = createElementWithStyles('div', {
    onmousedown: () => props.setIsOpen(false),
  }, modalStyles.overlay);

  return htmlx`
  <${overlay}/>
    <${container}>
      <${controlContainer}>
        <${closeButton}/>
      </${controlContainer}>
      <${bodyContainer}>
        <${props.body}/>
      </${bodyContainer}>
    </${container}>
  </${overlay}>
  `;
}
