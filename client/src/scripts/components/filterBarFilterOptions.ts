import {nameof} from 'Scripts/helpers';
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
      response = await fetch('http://0.0.0.0:8085/api/v1/getBrickColours');
    } catch (error) {
      console.error(error);
      return;
    }

    setColours(await response.json() as GetBrickColoursResponse);
  };

  const getTypes = async () => {
    let response;

    try {
      response = await fetch('http://0.0.0.0:8085/api/v1/getBrickTypes');
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

  const rowItem = createElementWithStyles('div', {textContent: 'test'}, filterBarStyles.filterBarOptionsRowItem);

  if (toggle) {
    rowContainer.classList.add(filterBarStyles.open);
  } else {
    rowContainer.classList.remove(filterBarStyles.open);
  }

  return htmlx`
    <${rowContainer}>
      <${rowItem}/>
    </rowContainer>
  `;
}
