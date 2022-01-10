import createFilterBarOptions from 'Scripts/components/filterBarOptions';
import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlTemplate';
import {createElementWithStyles} from 'Scripts/uiUtils';
import {registerUseRef} from 'Scripts/useRef';
import {registerUseState} from 'Scripts/useState';
import filterBarStyles from 'Styles/components/filterBar.module.scss';

const useState = registerUseState(nameof(createFilterBar));
const useRef = registerUseRef(nameof(createFilterBar));

export default function createFilterBar () {
  const [fff, sfff] = useState(false);

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
    {textContent: 'Sort'},
    filterBarStyles.filterBarItemLeft,
  );

  const filterBy = createElementWithStyles(
    'div',
    {textContent: 'Filter'},
    filterBarStyles.filterBarItemLeft,
  );

  filterBy.addEventListener('click', () => {
    sfff((previous) => !previous);
  });

  const search = createElementWithStyles(
    'input',
    {
      placeholder: 'Search',
    },
    filterBarStyles.filterBarSearchItem,
  );

  return htmlx`
    <${container}>
      <${mainRow}>
        <${leftSectionContainer}>
          <${sortBy}/>
          <${filterBy}/>
        </leftSectionContainer>
        <${rightSectionContainer}>
          <${search}/>
        </rightSectionContainer>
      </mainRow>
      <${createFilterBarOptions(fff)}/>
    </container>
  `;
}
