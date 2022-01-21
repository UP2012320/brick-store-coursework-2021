import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/components/filterBar.module.scss';

export default function createFilterBarOptions (toggle: boolean) {
  const rowContainer = createElementWithStyles('div', undefined, filterBarStyles.filterBarOptionsRowContainer);

  if (toggle) {
    rowContainer.classList.add(filterBarStyles.open);
  } else {
    rowContainer.classList.remove(filterBarStyles.open);
  }

  return htmlx`
    ${toggle ? htmlx`<${rowContainer}>
    </rowContainer>` : null}
  `;
}
