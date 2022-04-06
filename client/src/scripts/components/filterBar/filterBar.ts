import createDropdownFrame from 'Scripts/components/dropdown/dropdownFrame/dropdownFrame';
import createDropdownMultiSelectBody from 'Scripts/components/dropdown/dropdownMultiSelectBody/dropdownMultiSelectBody';
import type {MultiSelectDropDownOption} from 'Scripts/components/dropdown/dropdownMultiSelectBody/dropdownMultiSelectBody';
import {fetchColours, fetchTypes} from 'Scripts/components/filterBar/fetch';
import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
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

const orderBy = [
  {
    name: 'Price (low to high)',
    toggled: false,
    value: 'price',
  },
  {
    name: 'Price (high to low)',
    toggled: false,
    value: '-price',
  },
  {
    name: 'Name (A to Z)',
    toggled: true,
    value: 'name',
  },
  {
    name: 'Name (Z to A)',
    toggled: false,
    value: '-name',
  },
] as MultiSelectDropDownOption[];

export default function createFilterBar (props: CreateFilterBarProps) {
  const [colours, setColours] = useState<MultiSelectDropDownOption[]>([]);
  const [types, setTypes] = useState<MultiSelectDropDownOption[]>([]);
  // const [orderBy, setOrderBy] = useState<DropDownOption[]>();

  useEffect(nameof(createFilterBar), () => {
    fetchColours().then((coloursResponse) => {
      setColours(coloursResponse.map((colour) => ({
        name: colour.name,
        toggled: false,
        value: colour.id,
      })));
    });
    fetchTypes().then((typesResponse) => {
      setTypes(typesResponse.map((type) => ({
        name: type.type,
        toggled: false,
        value: type.id,
      })));
    });
  }, []);

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
        <${createDropdownFrame({
    body: createDropdownMultiSelectBody({
      dropDownOptions: colours,
      key: 'colours-multi-select',
      onOptionsChange: (options) => {},
    }),
    key: 'colours',
    title: 'Colours',
  })}/>
         <${createDropdownFrame({
    body: createDropdownMultiSelectBody({
      dropDownOptions: types,
      key: 'types-multi-select',
      onOptionsChange: (options) => {},
    }),
    key: 'types',
    title: 'Types',
  })}/>
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
