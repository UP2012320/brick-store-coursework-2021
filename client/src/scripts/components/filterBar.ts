import html from 'Scripts/htmlTemplate';
import {createElementWithStyles} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/components/filterBar.module.scss';

export default function createFilterBar () {
  const container = createElementWithStyles(
    'section',
    undefined,
    filterBarStyles.filterBarContainer,
  );

  const leftSectionContainer = createElementWithStyles(
    'section',
    undefined,
    filterBarStyles.filterBarSectionContainer,
  );
  const rightSectionContainer = createElementWithStyles(
    'section',
    undefined,
    filterBarStyles.filterBarSectionContainerRight,
  );

  const sortBy = createElementWithStyles(
    'div',
    {textContent: 'Sort'},
    filterBarStyles.filterBarItemLeft,
  );

  const filterBy = createElementWithStyles(
    'div',
    {textContent: 'Filter'},
    filterBarStyles.filterBarItemLeft,
  );

  const search = createElementWithStyles(
    'input',
    {
      placeholder: 'Search',
    },
    filterBarStyles.filterBarSearchItem,
  );

  return html`
    <${container}>
      <${leftSectionContainer}>
        <${sortBy}/>
        <${filterBy}/>
      </leftSectionContainer>
      <${rightSectionContainer}>
        <${search}/>
      </rightSectionContainer>
    </container>
  `;
}
