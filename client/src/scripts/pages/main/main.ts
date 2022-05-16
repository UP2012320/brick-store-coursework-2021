import htmlx from 'Scripts/htmlX';
import {createElement} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/contentRoot.module.scss';

export default function createMain () {
  const mainContainer = createElement('section', undefined, contentRootStyles.contentRoot);

  const indexForgot = createElement('h1', {
    textContent: 'I sort of forgot about a homepage',
  });

  return htmlx`
  <${mainContainer}>
    <${indexForgot}/>
  </mainContainer>
  `;
}
