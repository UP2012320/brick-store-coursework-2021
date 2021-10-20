export abstract class Component {
  children: Component[] = [];

  appendChild(component: Component) {
    this.children.push(component);
  }

  appendChildren(components: Component[]) {
    components.forEach((component) => {
      this.children.push(component);
    });
  }

  abstract build(): HTMLElement;

  protected buildAllChildren(): HTMLElement[] {
    const children: HTMLElement[] = [];

    this.children.forEach((child) => {
      children.push(child.build());
    });

    return children;
  }
}

export class Root extends Component {
  private readonly _rootId: string;

  constructor(rootId = '#id') {
    super();
    this._rootId = rootId;
  }

  build(): HTMLElement {
    const id = document.createElement(this._rootId);

    id.append(...this.buildAllChildren());

    return id;
  }
}
