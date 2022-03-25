import createFilterBarFilterOptions from 'Scripts/components/filterBarFilterOptions';
import {nameof} from 'Scripts/helpers';
import type {StateSetter} from 'Scripts/hooks/useState';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/components/filterBar.module.scss';
import type {SearchRequestArguments} from 'api-types';

const useState = registerUseState(nameof(createFilterBar));

export interface CreateFilterBarProps {
  setSearchArguments: StateSetter<SearchRequestArguments>;
}

export default function createFilterBar (props: CreateFilterBarProps) {
  const [filterToggle, setFilterToggle] = useState(false);
  const [sortToggle, setSortToggle] = useState(false);

  const container = createElementWithStyles(
    'section',
    undefined,
    filterBarStyles.filterBarContainer,
  );

  container.setAttribute('key', nameof(createFilterBar));

  const mainRow = createElementWithStyles('div', undefined, filterBarStyles.filterBarRowContainer);

  const LeftSectionContainer = createElementWithStyles(
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
    {
      onclick: () => {
        setSortToggle((previous) => !previous);
      },
      textContent: 'Sort',
    },
    filterBarStyles.filterBarItemLeft,
  );

  const filterBy = createElementWithStyles(
    'div',
    {
      onclick: () => {
        setFilterToggle((previous) => !previous);
      },
      textContent: 'Filter',
    },
    filterBarStyles.filterBarItemLeft,
  );

  const searchRow = createElementWithStyles('div', undefined, filterBarStyles.filterBarSearchRow);

  const onSearch = (query: string) => {
    props.setSearchArguments((previous) => ({...previous, query}));
  };

  const search = createElementWithStyles(
    'input',
    {
      onkeydown: ((event) => {
        if (event.key === 'Enter') {
          const target = event.target as HTMLInputElement;

          onSearch(target.value);
        }
      }),
      placeholder: 'Search',
    },
    filterBarStyles.filterBarSearchItem,
  );

  const searchButton = createElementWithStyles('div', {
    onclick: () => {
      const searchInput = document.querySelector(`.${filterBarStyles.filterBarSearchItem}`) as HTMLInputElement | undefined;

      if (searchInput) {
        onSearch(searchInput.value);
      }
    },
  }, filterBarStyles.filterBarSearchButton);

  const searchButtonIcon = createElementWithStyles('i', undefined, filterBarStyles.biSearch);

  return htmlx`
    <${container}>
      <${mainRow}>
        <${LeftSectionContainer}>
          <${sortBy}/>
          <${createFilterBarFilterOptions({key: 'sort', toggle: sortToggle})}/>
          <${filterBy}/>
          <${createFilterBarFilterOptions({key: 'filter', toggle: filterToggle})}/>
        </leftSectionContainer>
        <${rightSectionContainer}>
          <${searchRow}>
            <${search}/>
            <${searchButton}>
              <${searchButtonIcon}/>
            </searchButton>
          </searchRow>
        </rightSectionContainer>
      </mainRow>
    </container>
  `;
}
