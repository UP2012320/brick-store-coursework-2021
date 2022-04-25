import {nameof} from 'Scripts/helpers';
import {useRef} from 'Scripts/hooks/useRef';
import type {StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import type {HasBodyProps, ReUsableComponentProps} from 'Types/types';
import modalStyles from './modal.module.scss';

interface ModalProps extends ReUsableComponentProps, HasBodyProps {
  isOpen: boolean;
  setIsOpen: StateSetter<boolean>;
  title: string;
}

export default function createModal (props: ModalProps) {
  props.key ??= nameof(createModal);

  const dragging = useRef(props.key, false);

  const container = createKeyedContainer('div', props.key, {
    onmousedown: (event) => {
      event.stopPropagation();
    },
  }, modalStyles.container);

  const onMouseMove = (event: MouseEvent) => {
    if (dragging.current) {
      console.debug('running');
      const containerElement = document.querySelector(`.${modalStyles.container}`);

      console.debug(containerElement);

      if (containerElement) {
        const containerHtmlElement = containerElement as HTMLElement;
        const boundingClientRect = containerHtmlElement.getBoundingClientRect();
        const {pageX, pageY} = event;
        console.debug(`left ${boundingClientRect.left} top ${boundingClientRect.top} pageX ${pageX} pageY ${pageY}`);

        let newLeft = boundingClientRect.left + (pageX - boundingClientRect.left);
        let newTop = boundingClientRect.top + (pageY - boundingClientRect.top);

        if (newLeft < 0) {
          newLeft = 0;
        }

        if (newTop < 0) {
          newTop = 0;
        }

        containerHtmlElement.style.left = `${newLeft}px`;
        containerHtmlElement.style.top = `${newTop}px`;
      }
    }
  };

  const controlContainer = createElementWithStyles('div', {
    draggable: true,
    ondragend: (event) => {
      event.preventDefault();
      console.debug('onmouseup');
      dragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
    },
    ondragstart: (event) => {
      event.preventDefault();
      console.debug('onmousedown');
      dragging.current = true;
      document.addEventListener('mousemove', onMouseMove);
    },
  }, modalStyles.controlContainer);

  const title = createElementWithStyles('p', {
    textContent: props.title,
  }, modalStyles.title);

  const closeButton = createElementWithStyles('i', {
    onclick: () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      props.setIsOpen(false);
    },
  }, modalStyles.biX);

  const bodyContainer = createElementWithStyles('div', undefined, modalStyles.bodyContainer);

  const overlay = createElementWithStyles('div', {
    onmousedown: () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      props.setIsOpen(false);
    },
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
