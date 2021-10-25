import {Component} from 'Scripts/framework/component';
import {ComponentElement} from 'Scripts/framework/componentElement';
import {createElement} from 'Scripts/uiUtils';

export class Main extends Component {
  protected _setComponentRoot() {
    return new ComponentElement(createElement('div'));
  }

  _build(componentRoot: ComponentElement): Element {
    const [list, setList] = this._createStore<{id: number; text: string}[]>([]);

    const header = createElement('h1', {
      textContent: 'Your To-Do List',
    });

    const inputField = createElement('input', {
      placeholder: 'Add an item',
    });

    const submitButton = createElement('button', {
      textContent: 'Add',
    });
    submitButton.addEventListener('click', () =>
      this._registerCallback(() =>
        setList((prev) => [
          ...prev,
          {id: (list?.length ?? 0) + 1, text: inputField.value},
        ]),
      ),
    );

    const onDelete = this._getRegisterCallback((args: {id: number}) => {
      setList((prev) => {
        return prev.filter((item) => item.id !== args.id);
      });
    });

    const ul = createElement('ul');

    return componentRoot
      .then(header)
      .then(inputField)
      .then(submitButton)
      .down(ul)
      .thenComponent((parent) => {
        // I don't like how this implicitly adds to the parent tree by reference,
        // it's not intuitive

        list?.forEach((item) => {
          const li = new ListItem({...item, onDelete}, parent);
          li.build();
        });
      })
      .end();
  }
}

export class ListItem extends Component<{
  text: string;
  id: number;
  onDelete: (args: {id: number}) => void;
}> {
  protected _setComponentRoot() {
    // TODO Figure out how to solve this in the future, if the component root is passed via the constructor this isn't needed
    return new ComponentElement(createElement('div'));
  }

  protected _build(componentRoot: ComponentElement) {
    const li = createElement('li', {
      textContent: this._props.text,
    });

    const deleteButton = createElement('button', {
      textContent: 'Delete',
    });
    deleteButton.addEventListener('click', () =>
      this._props.onDelete({id: this._props.id}),
    );

    return componentRoot.then(li).then(deleteButton).end();
  }
}
