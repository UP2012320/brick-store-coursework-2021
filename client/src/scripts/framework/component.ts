import {ComponentElement} from 'Scripts/framework/componentElement';
import {Ref} from 'Scripts/framework/ref';

// If I cannot use React, I will create my own React! :D
// * 200% Extra Bugs

export abstract class Component<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  props?: T;
  private _nextStoreIndex = 0;
  private _store: Record<number, unknown> = {};
  private _renderCounter = 0;
  private _stateChanged = false;
  protected _componentRoot?: ComponentElement;
  protected _onFirstRender?: () => void;
  protected _onRender?: () => void;
  protected _beforeRemove?: () => void;

  constructor(props?: T) {
    this.props = props;
  }

  build(): Element {
    if (this._renderCounter === 0) {
      if (this._onFirstRender) {
        this._onFirstRender();
      }
    }

    if (this._onRender) {
      this._onRender();
    }

    const result = this._build();
    this._renderCounter++;

    return result;
  }

  protected abstract _build(): Element;

  protected registerCallback(func: () => void) {
    func();

    if (this._stateChanged) {
      this._stateChanged = false;
      this.rebuildTree();
    }
  }

  protected rebuildTree() {
    if (this._beforeRemove) {
      this._beforeRemove();
    }

    this._componentRoot?.clearChildren();
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
    this._stateChanged = true;
  }

  protected createStore<T>(
    defaultValue?: T,
  ): [T | undefined, (newValue: T | ((previous: T) => T)) => void] {
    const id = this._nextStoreIndex++;

    const setter = (newValue: T | ((previous: T) => T)) => {
      this._modifyStore(id, newValue);
    };

    if (this._store[id]) {
      return [this._store[id] as T, setter];
    }

    this._store[id] = defaultValue;

    return [defaultValue, setter];
  }

  protected createRef<T>(defaultValue?: T): Ref<T | undefined> {
    const id = this._nextStoreIndex++;

    const value = defaultValue;

    if (this._store[id]) {
      return this._store[id] as Ref<T>;
    }

    const storeRef = new Ref(value);

    this._store[id] = storeRef;

    return storeRef;
  }
}
