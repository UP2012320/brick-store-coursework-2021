import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import modalStyles from './modal.module.scss';

export default function createModal(props) {
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
