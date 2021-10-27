import ComponentElement from 'Scripts/framework/componentElement';
import Ref from 'Scripts/framework/ref';
import {createElement} from 'Scripts/uiUtils';

// If I cannot use React, I will create my own React! :D
// * 200% Extra Bugs

export default abstract class Component<T extends Record<string, unknown> = Record<string, unknown>,
  > {
  protected _props: T;
  private _nextStoreIndex = 0;
  private _store: Record<number, unknown> = {};
  private _renderCounter = 0;
  private _stateChanged = false;
  private _componentRoot?: ComponentElement;

  constructor(props: T, componentRoot?: ComponentElement) {
    this._props = props;
    this._componentRoot = componentRoot;
  }

  build() {
    let result: Element;

    if (!this._componentRoot) {
      this._componentRoot = this._setComponentRoot();
      result = this._build(this._componentRoot);
    } else {
      result = this._build(this._componentRoot);
    }

    this._renderCounter++;

    return result;
  }

  protected _setComponentRoot() {
    return new ComponentElement(createElement('div'));
  }

  protected abstract _build(componentRoot: ComponentElement): Element;

  protected _registerEffect(callback: () => void, dependencies?: unknown[]) {
    const id = this._nextStoreIndex++;

    const value = this._store[id] as unknown[] | undefined;

    if (value) {
      if (value.length !== 0 && !Object.is(value, dependencies)) {
        callback();
      }
    } else if (dependencies === undefined) {
      callback();
    } else if (dependencies.length === 0 && this._renderCounter === 0) {
      callback();
    } else {
      this._store[id] = dependencies;
    }
  }

  protected _registerStatefulCallback(func: () => void) {
    func();

    if (this._stateChanged) {
      this._stateChanged = false;
      this._rebuildTree();
    }
  }

  protected _getStatefulCallback<P extends Record<string, unknown>>(func: (args: P) => void) {
    return (args: P) => {
      func(args);

      if (this._stateChanged) {
        this._stateChanged = true;
        this._rebuildTree();
      }
    };
  }

  protected _rebuildTree() {
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

  protected _createStore<T>(
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

  protected _createRef<T>(defaultValue?: T): Ref<T | undefined> {
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
