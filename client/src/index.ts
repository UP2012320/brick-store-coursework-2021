import styles from 'Styles/root.module.scss';
import createNavbar from 'Scripts/components/layout/navbar';
import createBrowse from 'Scripts/components/browse';
import {createElement} from 'Scripts/uiUtils';
import createFooter from 'Scripts/components/layout/footer';
import createMain from 'Scripts/components/main';

function render() {
  console.debug('rendering');
  const root = document.querySelector('#root');

  if (!root) {
    console.error('Something has gone horribly wrong, where\'s #root!??');
    return;
  }

  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  const internalRoot = createElement('div', {
    id: styles.root
  });

  internalRoot.appendChild(createNavbar());

  switch (window.location.pathname) {
    case '/':
      internalRoot.appendChild(createMain());
      break;
    case '/browse':
      internalRoot.appendChild(createBrowse());
      break;
  }

  internalRoot.appendChild(createFooter());

  root.appendChild(internalRoot);
}

function main() {
  render();

  window.addEventListener('popstate', render);
}

main();
