import htmlx from 'Scripts/htmlTemplate';
import {createElement, createElementWithStyles} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/components/filterBar.module.scss';

export default function createFilterBarOptions (toggle: boolean) {
  const rowContainer = createElementWithStyles('div', undefined, filterBarStyles.filterBarOptionsRowContainer);

  if (toggle) {
    rowContainer.classList.add(filterBarStyles.open);
  } else {
    rowContainer.classList.remove(filterBarStyles.open);
  }

  return htmlx`
    <${rowContainer}>
      <${createElement('p', {textContent: 'test'})}/>
    </rowContainer>
  `;
}
