import { createElementWithStyles } from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/filterbar.module.scss';

export default function createFilterBar() {
  const container = createElementWithStyles(
    'div',
    undefined,
    filterBarStyles.filterBarContainer,
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
    'div',
    undefined,
    filterBarStyles.filterBarItemRight,
  );

  search.append('search');

  container.append(sortBy, filterBy, search);

  return container;
}
