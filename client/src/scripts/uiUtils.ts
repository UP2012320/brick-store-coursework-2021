import {CreateElementOptions} from 'Types/types';

export function createElement<K extends keyof HTMLElementTagNameMap>(
  type: K,
  options?: Partial<CreateElementOptions>,
): HTMLElementTagNameMap[K] {
  const newElement = document.createElement(type) as HTMLElementTagNameMap[K];

  newElement.textContent = options?.textContent ?? '';
  newElement.classList.add(...(options?.classNames ?? []));
  newElement.id = options?.textContent ?? '';

  return newElement;
}
