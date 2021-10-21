export interface CreateElementOptions {
  id: string;
  classes: string[] | string;
  textContent: string;
  title: string;
}

export interface StateRef<T> {
  value?: T;
}
