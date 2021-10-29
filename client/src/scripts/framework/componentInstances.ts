import Component from 'Scripts/framework/component';

export class ComponentInstances {
  private _instances: Record<string, Component> = {};

  createInstance(component: Component, id: string) {
    if (this._instances[id]) {
      return this._instances[id];
    }

    this._instances[id] = component;

    return component;
  }
}
