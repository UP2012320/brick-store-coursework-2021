import Component from 'Scripts/framework/component';

export default class ComponentElement {
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

  thenComponent(component: Component) {
    component.build(this);

    return this;
  }

  private _internalThen(element: Element) {
    const e = new ComponentElement(element, this);
    this.children.push(e);
  }

  up(steps = 1) {
    let returnValue = this.parent;

    for (let i = 0; i < steps; i++) {
      if (!returnValue?.parent) {
        break;
      }

      returnValue = returnValue?.parent;
    }

    if (!returnValue) {
      returnValue = this;
    }

    return returnValue;
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
