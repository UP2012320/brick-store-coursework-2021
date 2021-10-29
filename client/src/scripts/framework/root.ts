import Main from 'Scripts/components/main';
import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import Navbar from 'Scripts/components/layout/navbar';
import Footer from 'Scripts/components/layout/footer';
import styles from 'Styles/root.module.scss';
import {createElement} from 'Scripts/uiUtils';

export default class Root extends Component {
  _internalBuild(componentRoot: ComponentElement): Element {
    const root = createElement('div', {
      id: styles.root
    });
    const navbar = new Navbar({});
    const main = new Main({});
    const footer = new Footer({});

    const onPopStateHandler = () => {
      this._rebuildTree();
    };

    this._registerEffect(() => {
      window.addEventListener('popstate', onPopStateHandler);

      return () => {
        window.removeEventListener('popstate', onPopStateHandler);
      };
    });

    return componentRoot.useMapping([
      {
        root,
        children: [
          navbar,
          {
            route: '/',
            main
          },
          footer
        ]
      }
    ]).end();
  }
}
