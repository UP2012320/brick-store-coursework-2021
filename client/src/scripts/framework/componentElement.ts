export class ComponentElement {
  element: Element;
  parent?: ComponentElement;
  children: ComponentElement[] = [];

  constructor(element: Element, parent?: ComponentElement) {
    this.element = element;
    this.parent = parent;
  }

  static create(element: Element, parent?: ComponentElement) {
    return new ComponentElement(element, parent);
  }

  down(element: Element) {
    const e = new ComponentElement(element, this);
    this.children.push(e);
    return e;
  }

  then(element: Element) {
    const e = new ComponentElement(element, this);
    this.children.push(e);
    return this;
  }

  up() {
    return this.parent ? this.parent : this;
  }

  clearChildren(clearSelf = true) {
    const children: Element[] = [];
    const queue: ComponentElement[] = [];

    if (clearSelf) {
      queue.push(this);
    } else {
      let child: ComponentElement | undefined;

      while ((child = this.children.shift())) {
        queue.push(child);
      }
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
