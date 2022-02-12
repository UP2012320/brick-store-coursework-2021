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

  const mainRow = createElementWithStyles('div', undefined, filterBarStyles.filterBarRowContainer);

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

  const search = createElementWithStyles(
    'input',
    {
      onkeydown: ((event) => {
        if (event.key === 'Enter') {
          props.setSearchArguments((previous) => {
            console.debug({...previous, query: search.value});
            return ({...previous, query: search.value});
          });
        }
      }),
      placeholder: 'Search',
    },
    filterBarStyles.filterBarSearchItem,
  );

  return htmlx`
    <${container}>
      <${mainRow}>
        <${leftSectionContainer}>
          <${sortBy}/>
          <${createFilterBarFilterOptions(sortToggle)}/>
          <${filterBy}/>
          <${createFilterBarFilterOptions(filterToggle)}/>
        </leftSectionContainer>
        <${rightSectionContainer}>
          <${search}/>
        </rightSectionContainer>
      </mainRow>
    </container>
  `;
}
