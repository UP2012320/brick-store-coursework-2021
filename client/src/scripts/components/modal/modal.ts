import {nameof} from 'Scripts/helpers';
import {type StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import {type HasBodyProps, type ReUsableComponentProps} from 'Types/types';
import modalStyles from './modal.module.scss';

interface ModalProps extends ReUsableComponentProps, HasBodyProps {
  isOpen: boolean;
  setIsOpen: StateSetter<boolean>;
  title: string;
}

export default function createModal (props: ModalProps) {
  props.key ??= nameof(createModal);

  const close = () => props.setIsOpen(false);

  const container = createKeyedContainer('div', props.key, {
    onmousedown: (event) => {
      event.stopPropagation();
    },
  }, modalStyles.container);
  const controlContainer = createElement('div', undefined, modalStyles.controlContainer);

  const title = createElement('p', {
    textContent: props.title,
  }, modalStyles.title);

  const closeButton = createElement('i', {
    onclick: () => close(),
  }, modalStyles.biX);

  const bodyContainer = createElement('div', undefined, modalStyles.bodyContainer);

  const overlay = createElement('div', {
    onmousedown: () => close(),
  }, modalStyles.overlay);

  return htmlx`
  <${overlay}/>
    <${container}>
      <${controlContainer}>
        <${title}/>
        <${closeButton}/>
      </${controlContainer}>
      <${bodyContainer}>
        <${props.body}/>
      </${bodyContainer}>
    </${container}>
  </${overlay}>
  `;
}
