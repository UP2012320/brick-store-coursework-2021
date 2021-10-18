import 'Styles/reset.scss';

import {createElement} from 'Scripts/uiUtils';

const id = document.querySelector('#root');

const p = createElement('p');

if (id) {
  id.appendChild(p);
}
