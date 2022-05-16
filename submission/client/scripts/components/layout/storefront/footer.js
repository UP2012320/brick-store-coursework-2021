import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement} from 'Scripts/uiUtils';
// eslint-disable-next-line import/no-unassigned-import
import 'Styles/components/footer.module.scss';

export default function createFooter() {
  const footer = createElement('footer');
  footer.setAttribute('key', nameof(createFooter));
  return htmlx`
    <${footer}>
      <${createElement('p', {textContent: 'footer'})}/>
    </footer>
  `;
}
