import createAllFilters from 'Scripts/components/allFilters/allFilters';
import createCollapse from 'Scripts/components/collapse/collapse';
import createDropdown from 'Scripts/components/dropdown/dropdownFrame/dropdownFrame';
import createDropdownMultiSelectBody from 'Scripts/components/dropdown/dropdownMultiSelectBody/dropdownMultiSelectBody';
import createDropdownSingleSelectBody from 'Scripts/components/dropdown/dropdownSingleSelectBody/dropdownSingleSelectBody';
import {fetchColours, fetchTypes} from 'Scripts/components/filterBar/fetch';
import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useRef} from 'Scripts/hooks/useRef';
import type {StateSetter} from 'Scripts/hooks/useState';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/components/filterBar.module.scss';
import type {DropDownOption, MultiSelectDropDownOption} from 'Types/types';
import type {SearchRequestArguments} from 'api-types';

const useState = registerUseState(nameof(createFilterBar));

export interface CreateFilterBarProps {
  setFilters: StateSetter<Record<string, string[]>>;
  setSearchArguments: StateSetter<SearchRequestArguments>;
}

const sortOptions = [
  {
    name: 'Name (A to Z)',
    value: 'item_name',
  },
  {
    name: 'Name (Z to A)',
    value: '-item_name',
  },
  {
    name: 'Price (low to high)',
    value: 'price',
  },
  {
    name: 'Price (high to low)',
    value: '-price',
  },
] as DropDownOption[];

export default function createFilterBar (props: CreateFilterBarProps) {
  const [colours, setColours] = useState<MultiSelectDropDownOption[]>([]);
  const [types, setTypes] = useState<MultiSelectDropDownOption[]>([]);
  const searchValue = useRef<string>('');

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

          searchValue.current = target.value;
          onSearch(target.value);
        }
      }),
      placeholder: 'Search',
      value: searchValue.current ?? '',
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

  const orderByDropdown = htmlx`
  <${createDropdown({
    body: createDropdownSingleSelectBody({
      dropDownOptions: sortOptions,
      key: 'sort-select',
      onSelectedChange: (option) => {
        props.setFilters((previous) => ({
          ...previous,
          order: [option.value],
        }));
      },
    }),
    key: 'sort',
    title: 'Sort By',
  })}/>
  `;

  const colourDropdown = htmlx`
   <${createDropdown({
    body: createDropdownMultiSelectBody({
      dropDownOptions: colours,
      key: 'colours-multi-select',
      onOptionsChange: (options) => {
        props.setFilters((previous) => ({
          ...previous,
          colours: options
            .filter((option) => option.toggled)
            .map((option) => option.value),
        }));
      },
    }),
    key: 'colours',
    title: 'Colours',
  })}/>
   `;

  const typeDropdown = htmlx`
  <${createDropdown({
    body: createDropdownMultiSelectBody({
      dropDownOptions: types,
      key: 'types-multi-select',
      onOptionsChange: (options) => {
        props.setFilters((previous) => ({
          ...previous,
          types: options
            .filter((option) => option.toggled)
            .map((option) => option.value),
        }));
      },
    }),
    key: 'types',
    title: 'Types',
  })}/>
  `;

  const allFilters = createAllFilters({
    body: [
      createCollapse({
        body: createDropdownMultiSelectBody({
          dropDownOptions: types,
          key: 'types-multi-select-sidebar',
          onOptionsChange: (options) => {
            props.setFilters((previous) => ({
              ...previous,
              types: options
                .filter((option) => option.toggled)
                .map((option) => option.value),
            }));
          },
        }),
        key: 'types-sidebar',
        title: 'Types',
      }),
      createCollapse({
        body: createDropdownMultiSelectBody({
          dropDownOptions: colours,
          key: 'colours-multi-select-sidebar',
          onOptionsChange: (options) => {
            props.setFilters((previous) => ({
              ...previous,
              colours: options
                .filter((option) => option.toggled)
                .map((option) => option.value),
            }));
          },
        }),
        key: 'colours-sidebar',
        title: 'Colours',
      }),
    ],
  });

  return htmlx`
    <${container}>
      <${mainRow}>
        <${LeftSectionContainer}>
          <${orderByDropdown}/>
          <${colourDropdown}/>
          <${typeDropdown}/>
          <${allFilters}/>
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