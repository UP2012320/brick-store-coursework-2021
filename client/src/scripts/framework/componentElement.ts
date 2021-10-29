import Component from 'Scripts/framework/component';

enum MappingType {
  element,
  componentElement,
  component,
  unknown
}

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

  useMapping(mapping: (Record<string, object> | object)[]) {
    mapping.forEach(map => {
      this._unwrapMappingChild(map, this);
    });

    return this;
  }

  private _unwrapMapping(map: Record<string, object | string>, parent: ComponentElement) {
    const values = Object.entries(map)
      .filter(([key]) => key !== 'children' && key !== 'route')
      .map(([, value]) => value);

    const children = map['children'] as object[] | undefined;
    const route = map['route'] as string | undefined;

    const isRoute = window.location.pathname === route;

    const runIfRouteMatches = (func: () => void) => {
      if (route) {
        if (isRoute) {
          func();
        }
      } else {
        func();
      }
    };

    let newParent = parent;

    values.forEach(value => {
      const type = Helpers.getType(value);

      switch (type) {
        case MappingType.element:
          const element = value as Element;

          runIfRouteMatches(() => {
            if (children) {
              newParent = parent.down(element);
            } else {
              parent.then(element);
            }
          });
          break;
        case MappingType.componentElement:
          const componentElement = value as ComponentElement;
          parent.children.push(componentElement);

          runIfRouteMatches(() => {
            parent.children.push(componentElement);

            if (children) {
              newParent = componentElement;
            }
          });
          break;
        case MappingType.component:
          const component = value as Component;

          runIfRouteMatches(() => {
            parent.thenComponent(component);

            if (children) {
              throw new Error('When using a Component directly in the mapping, you cannot have any children');
            }
          });
          break;
        case MappingType.unknown:
          throw new Error(`Unknown type passed - ${value}`);
      }
    });

    if (children) {
      children.forEach(child => {
        this._unwrapMappingChild(child, newParent);
      });
    }
  }

  private _unwrapMappingChild(child: object, parent: ComponentElement) {
    if (Object.values(child).length === 0 || '_nextStoreIndex' in child) {
      const type = Helpers.getType(child);

      switch (type) {
        case MappingType.element:
          const element = child as Element;
          parent.then(element);
          break;
        case MappingType.componentElement:
          const componentElement = child as ComponentElement;
          parent.children.push(componentElement);
          break;
        case MappingType.component:
          const component = child as Component;

          parent.thenComponent(component);
          break;
        case MappingType.unknown:
          throw new Error(`Unknown type passed - ${child}`);
      }
    } else {
      this._unwrapMapping(child as Record<string, object | string>, parent);
    }
  }

  private _internalThen(element: Element) {
    const e = new ComponentElement(element, this);
    this.children.push(e);
  }

  merge(componentElement: ComponentElement) {
    componentElement.parent = this;
    this.children.push(componentElement);
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

class Helpers {
  static getType(value: unknown) {
    if (value instanceof Element) {
      return MappingType.element;
    } else if (value instanceof ComponentElement) {
      return MappingType.componentElement;
    } else if (value instanceof Component) {
      return MappingType.component;
    }

    return MappingType.unknown;
  }
}
