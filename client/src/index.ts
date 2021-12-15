import createBrowse from 'Scripts/components/browse';
import createFooter from 'Scripts/components/layout/footer';
import createNavbar from 'Scripts/components/layout/navbar';
import createMain from 'Scripts/components/main';
import {
  createElement,
} from 'Scripts/uiUtils';
import styles from 'Styles/root.module.scss';

const render = () => {
  console.debug('rendering');
  const root = document.querySelector('#root');

  if (!root) {
    console.error("Something has gone horribly wrong, where's #root!??");
    return;
  }

  while (root.firstChild) {
    root.firstChild.remove();
  }

  const internalRoot = createElement('div', {
    id: styles.root,
  });

  internalRoot.append(createNavbar());

  switch (window.location.pathname) {
    case '/browse':
      internalRoot.append(createBrowse());
      break;
    default:
      internalRoot.append(createMain());
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
