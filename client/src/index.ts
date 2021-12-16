import createBrowse from 'Scripts/components/browse';
import createFooter from 'Scripts/components/layout/footer';
import createNavbar from 'Scripts/components/layout/navbar';
import createMain from 'Scripts/components/main';
import createRouter from 'Scripts/createRouter';
import {createElement} from 'Scripts/uiUtils';
import styles from 'Styles/root.module.scss';

const render = () => {
  console.debug('rendering');
  const root = document.querySelector('#root');

  if (!root) {
    console.error('Something has gone horribly wrong, where\'s #root!??');
    return;
  }

  while (root.firstChild) {
    root.firstChild.remove();
  }

  const internalRoot = createElement('div', {
    id: styles.root,
  });

  internalRoot.append(createNavbar());

  const targetedRoute = createRouter([
    {
      name: 'browse',
      route: '/browse',
    },
    {
      name: 'main',
      route: '/',
    },
  ]);

  switch (targetedRoute) {
    case 'browse':
      internalRoot.append(createBrowse());
      break;
    case 'main':
      internalRoot.append(createMain());
      break;
    case undefined:
    default:
      // Insert 404 page
      break;
  }

  internalRoot.append(createFooter());

  root.append(internalRoot);
};

const main = () => {
  render();

  window.addEventListener('popstate', render);
};

main();
