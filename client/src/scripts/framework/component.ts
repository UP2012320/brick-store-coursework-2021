import {ComponentElement} from 'Scripts/framework/componentElement';

// If I cannot use React, I will create my own React! :D
// * 200% Extra Bugs

export abstract class Component<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  props?: T;
  private _nextStoreIndex = 0;
  private _store: Record<number, unknown> = {};
  protected _componentRoot?: ComponentElement;

  constructor(props?: T) {
    this.props = props;
  }

  abstract build(): Element;

  protected rebuildTree(clearSelf = true) {
    this._componentRoot?.clearChildren(false);
    this._nextStoreIndex = 0;
    this.build();
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

