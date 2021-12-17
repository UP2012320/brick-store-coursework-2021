import {createElementWithStyles} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/filterBar.module.scss';

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
    undefined,
    filterBarStyles.filterBarItemLeft,
  );

  sortBy.append('Sort');

  const filterBy = createElementWithStyles(
    'div',
    undefined,
    filterBarStyles.filterBarItemLeft,
  );

  filterBy.append('Filter');

  const search = createElementWithStyles(
    'input',
    {
      placeholder: 'Search',
    },
    filterBarStyles.filterBarSearchItem,
  );

  leftSectionContainer.append(sortBy, filterBy);

  rightSectionContainer.append(search);

  container.append(leftSectionContainer, rightSectionContainer);

  return container;
}
