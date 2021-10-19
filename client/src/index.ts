import 'Styles/reset.scss';

import {createElement} from 'Scripts/uiUtils';
import indexCss from 'Styles/index.scss';

const id = document.querySelector('#root');

const p = createElement('p', {
  textContent: 'Hello World!',
  classes: indexCss.test,
});

if (id) {
  id.appendChild(p);
}
