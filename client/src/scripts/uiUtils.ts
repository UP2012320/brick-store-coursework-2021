export function createElement<K extends keyof HTMLElementTagNameMap>(
  type: K,
  options?: Partial<HTMLElementTagNameMap[K]>,
): HTMLElementTagNameMap[K] {
  const newElement = document.createElement(type) as HTMLElementTagNameMap[K];

  return Object.assign(newElement, options);
}

export function createElementWithStyles<K extends keyof HTMLElementTagNameMap>(type: K,
  options?: Partial<HTMLElementTagNameMap[K]>,
  ...styles: string[]) {
  const newElement = createElement(type, options);
  newElement.classList.add(...styles);

  return newElement;
}
