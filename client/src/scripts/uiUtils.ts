import {CreateElementOptions} from 'Types/types';

export function createElement<K extends keyof HTMLElementTagNameMap>(
  type: K,
  options?: Partial<CreateElementOptions>,
): HTMLElementTagNameMap[K] {
  const newElement = document.createElement(type) as HTMLElementTagNameMap[K];

  const classes = Array.isArray(options?.classes)
    ? options?.classes ?? []
    : [options?.classes ?? ''];

  if (options?.textContent) {
    newElement.textContent = options?.textContent;
  }

  if (options?.classes) {
    newElement.classList.add(...classes);
  }

  if (options?.id) {
    newElement.id = options.id;
  }

  if (options?.title) {
    newElement.title = options.title;
  }

  return newElement;
}
