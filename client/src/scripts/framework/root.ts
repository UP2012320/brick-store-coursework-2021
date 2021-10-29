import Main from 'Scripts/components/main';
import Component from 'Scripts/framework/component';
import ComponentElement from 'Scripts/framework/componentElement';
import Navbar from 'Scripts/components/layout/navbar';
import Footer from 'Scripts/components/layout/footer';
import styles from 'Styles/root.module.scss';
import {createElement} from 'Scripts/uiUtils';
import Browse from 'Scripts/components/browse';

export default class Root extends Component {
  _internalBuild(componentRoot: ComponentElement): Element {
    const root = createElement('div', {
      id: styles.root
    });

    const navbar = this._componentInstances.createInstance(new Navbar({}), 'nav');
    const main = this._componentInstances.createInstance(new Main({}), 'main');
    const browse = this._componentInstances.createInstance(new Browse({}), 'browse');
    const footer = this._componentInstances.createInstance(new Footer({}), 'footer');

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
          {
            route: '/browse',
            browse
          },
          footer
        ]
      }
    ]).end();
  }
}
