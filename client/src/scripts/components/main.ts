import {createElement} from 'Scripts/uiUtils';
import mainStyles from 'Styles/main.module.scss';

export default function createMain() {
  const mainContainer = createElement('section', {
    id: mainStyles.main
  });

  return mainContainer;
}
