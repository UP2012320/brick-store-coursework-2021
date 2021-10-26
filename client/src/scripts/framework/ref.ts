interface InternalRef<T> {
  value?: T;
}

// The reason for this setup of placing the value inside an object and returning Ref<T>
// is because certain primitive types such as integers are passed by value and not
// by reference and as such changes will not be replicated in all places
// referenced. If the value is instead placed inside an object as a property
// and that property is updated then the reference to the object will
// include the updated property even if it's a primitive.

export default class Ref<T> {
  get value(): T | undefined {
    return this._value.value;
  }

  set value(value: T | undefined) {
    this._value = {
      value,
    };
  }

  private _value: InternalRef<T | undefined>;

  constructor(value?: T) {
    this._value = {
      value,
    };
  }
}
