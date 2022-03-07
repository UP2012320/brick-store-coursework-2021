import createDropDown from 'Scripts/components/dropdown';
import {nameof, serverBaseUrl} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/components/filterBar.module.scss';
import type {GetBrickColoursResponse, GetBrickTypesResponse} from 'api-types';

const useState = registerUseState(nameof(createFilterBarFilterOptions));

export default function createFilterBarFilterOptions (toggle: boolean) {
  const [colours, setColours] = useState<GetBrickColoursResponse | undefined>(undefined);
  const [types, setTypes] = useState<GetBrickTypesResponse | undefined>(undefined);

  const getColours = async () => {
    let response;

    try {
      response = await fetch(new URL('/api/v1/getBrickColours', serverBaseUrl).href);
    } catch (error) {
      console.error(error);
      return;
    }

    setColours(await response.json() as GetBrickColoursResponse);
  };

  const getTypes = async () => {
    let response;

    try {
      response = await fetch(new URL('/api/v1/getBrickTypes', serverBaseUrl).href);
    } catch (error) {
      console.error(error);
      return;
    }

    setTypes(await response.json() as GetBrickTypesResponse);
  };

  useEffect(nameof(createFilterBarFilterOptions), () => {
    getColours();
    getTypes();
  }, []);

  const rowContainer = createElementWithStyles('div', undefined, filterBarStyles.filterBarOptionsRowContainer);

  const rowItem = createElementWithStyles('div', undefined, filterBarStyles.filterBarOptionsRowItem);

  const dropDown = createDropDown({
    onselect: (valueSelected) => {
      console.debug(valueSelected);
    }, options: {test: 'name'},
  });

  if (toggle) {
    rowContainer.classList.add(filterBarStyles.open);
  } else {
    rowContainer.classList.add(filterBarStyles.open);
  }

  return htmlx`
    <${rowContainer}>
      <${rowItem}>
        <${dropDown}/>
      </rowItem>
    </rowContainer>
  `;
}
