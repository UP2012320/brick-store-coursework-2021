export class ComponentElement {
  element: Element;
  parent?: ComponentElement;
  children: ComponentElement[] = [];

  constructor(element: Element, parent?: ComponentElement) {
    this.element = element;
    this.parent = parent;
  }

  down(element: Element) {
    const e = new ComponentElement(element, this);
    this.children.push(e);
    return e;
  }

  then(elements: Element | Element[]) {
    if (Array.isArray(elements)) {
      elements.forEach((element) => {
        this._internalThen(element);
      });
    } else {
      this._internalThen(elements);
    }

    return this;
  }

  thenComponent(func: (parent?: ComponentElement) => void) {
    func(this);

    return this;
  }

  private _internalThen(element: Element) {
    const e = new ComponentElement(element, this);
    this.children.push(e);
  }

  up() {
    return this.parent ? this.parent : this;
  }

  clearChildren() {
    const children: Element[] = [];
    const queue: ComponentElement[] = [];

    let child: ComponentElement | undefined;

    while ((child = this.children.shift())) {
      queue.push(child);
    }

    while (queue.length > 0) {
      const element = queue.pop();

      if (element) {
        children.push(element.element);

        let child: ComponentElement | undefined;

        while ((child = element.children.shift())) {
          queue.push(child);
        }
      }
    }

    children.forEach((child) => {
      child.remove();
    });
  }

  private _build() {
    this.children.forEach((child) => {
      this.element.appendChild(child._build());
    });

    return this.element;
  }

  end() {
    let parent = this.parent;

    while (parent?.parent) {
      parent = parent?.parent;
    }

    return parent ? parent._build() : this._build();
  }
}
