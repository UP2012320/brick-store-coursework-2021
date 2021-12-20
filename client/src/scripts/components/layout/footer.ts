import htmlx from 'Scripts/htmlTemplate';
import {createElement} from 'Scripts/uiUtils';
// eslint-disable-next-line import/no-unassigned-import
import 'Styles/components/footer.module.scss';

export default function createFooter () {
  const footer = createElement('footer');

  return htmlx`
    <${footer}>
      <${createElement('p', {textContent: 'footer'})}/>
    </footer>
  `;
}
