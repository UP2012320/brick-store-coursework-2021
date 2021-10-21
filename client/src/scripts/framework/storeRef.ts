import {StateRef} from 'Types/types';

export class StoreRef<T> {
  get value(): T | undefined {
    return this._value.value;
  }

  set value(value: T | undefined) {
    this._value = {
      value,
    };
  }

  private _value: StateRef<T | undefined>;

  constructor(value?: T) {
    this._value = {
      value,
    };
  }
}
