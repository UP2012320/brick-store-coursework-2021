import {createElement} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/contentRoot.module.scss';

export default function createMain () {
  const mainContainer = createElement('section', {
    id: contentRootStyles.contentRoot,
  });

  return mainContainer;
}
