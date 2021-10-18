import {CreateElementOptions} from 'Types/types';

export function createElement<K extends keyof HTMLElementTagNameMap>(
  type: K,
  options?: Partial<CreateElementOptions>,
): HTMLElementTagNameMap[K] {
  const newElement = document.createElement(type) as HTMLElementTagNameMap[K];

  const classes = Array.isArray(options?.classes)
    ? options?.classes ?? []
    : [options?.classes ?? ''];

  newElement.textContent = options?.textContent ?? '';
  newElement.classList.add(...classes);
  newElement.id = options?.textContent ?? '';

  return newElement;
}
