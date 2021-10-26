import Main from 'Scripts/components/main';
import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import Navbar from 'Scripts/components/layout/navbar';
import Footer from 'Scripts/components/layout/footer';
import styles from 'Styles/root.module.scss';
import {createElement} from 'Scripts/uiUtils';

export class Root extends Component {
  _build(componentRoot: ComponentElement): Element {
    const root = createElement('div', {
      id: styles.root
    });
    const navbar = new Navbar({}).build();
    const main = new Main({}).build();
    const footer = new Footer({}).build();

    return componentRoot
      .down(root)
      .then(navbar)
      .then(main)
      .then(footer)
      .end();
  }
}
