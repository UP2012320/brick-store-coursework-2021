import {ComponentElement} from 'Scripts/framework/componentElement';

// If I cannot use React, I will create my own React! :D
// * 200% Extra Bugs

export abstract class Component<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  children: Component[] = [];
  parent?: Component;
  props?: T;
  private _nextStoreIndex = 0;
  private _store: Record<number, unknown> = {};
  protected _componentRoot?: ComponentElement;

  constructor(componentRoot?: ComponentElement, props?: T) {
    this.props = props;
  }

  appendChild(component: Component) {
    component.parent = this;
    this.children.push(component);
  }

  appendChildren(components: Component[]) {
    components.forEach((component) => {
      this.appendChild(component);
    });
  }

  abstract build(): Element;

  protected buildAllChildren(): Element[] {
    const children: Element[] = [];

    this.children.forEach((child) => {
      children.push(child.build());
    });

    return children;
  }

  protected rebuildTree(clearSelf = true) {
    this._componentRoot?.clearChildren(false);
    this._nextStoreIndex = 0;
    this.build();
    this.buildAllChildren();
  }

  private _modifyStore<T>(id: number, newValue: T | ((previous: T) => T)) {
    let valueTemp: T | undefined;

    if (newValue instanceof Function) {
      valueTemp = newValue(this._store[id] as T);
    } else {
      valueTemp = newValue;
    }

    this._store[id] = valueTemp;
    this.rebuildTree();
  }

  protected createStore<T>(
    defaultValue?: T,
  ): [T | undefined, (newValue: T | ((previous: T) => T)) => void] {
    const id = this._nextStoreIndex++;

    const value = defaultValue;

    const setter = (newValue: T | ((previous: T) => T)) => {
      this._modifyStore(id, newValue);
    };

    if (this._store[id]) {
      return [this._store[id] as T, setter];
    }

    this._store[id] = value;

    return [value, setter];
  }
}

export class Root extends Component {
  private readonly _rootId: string;

  constructor(rootId = '#root') {
    super();
    this._rootId = rootId;
  }

  protected rebuildTree() {
    this.build();
  }

  build(): Element {
    const id = document.querySelector(this._rootId);

    if (id) {
      this._componentRoot = new ComponentElement(id);
      this._componentRoot.element.append(...this.buildAllChildren());
      return this._componentRoot.element;
    }

    throw new Error('Root ID not found');
  }
}
