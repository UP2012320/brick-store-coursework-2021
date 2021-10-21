class ComponentElement {
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

  then(element: Element) {
    const e = new ComponentElement(element, this);
    this.children.push(e);
    return e;
  }

  up() {
    return this.parent ? this.parent : this;
  }

  private build() {
    let child: ComponentElement | undefined;

    while ((child = this.children.shift())) {
      this.element.appendChild(child.build());
    }

    return this.element;
  }

  end() {
    let parent = this.parent;

    while (parent?.parent) {
      parent = parent?.parent;
    }

    return parent?.build();
  }
}
