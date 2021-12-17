import createFooter from 'Scripts/components/layout/footer';
import createNavbar from 'Scripts/components/layout/navbar';
import createRouter from 'Scripts/createRouter';
import createBrowse from 'Scripts/pages/browse';
import createMain from 'Scripts/pages/main';
import createNotFound from 'Scripts/pages/notFound';
import {createElement} from 'Scripts/uiUtils';
import rootStyles from 'Styles/components/root.module.scss';

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
    id: rootStyles.root,
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
      internalRoot.append(createNotFound());
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
