import createFilterBar from 'Scripts/components/filterBar';
import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createElementWithStyles} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/components/contentRoot.module.scss';
import browseStyles from 'Styles/pages/browse.module.scss';
import type {SearchQueryResponse, SearchRequestArguments} from 'api-types';

export interface BrowseProps {
  queryStrings?: Record<string, string>;
}

const useState = registerUseState(nameof(createBrowse));

const searchForProducts = async (searchArguments: SearchRequestArguments) => {
  let response: Response;

  try {
    console.debug('fetching');
    response = await fetch('http://0.0.0.0:8085/api/v1/search', {
      body: JSON.stringify(searchArguments),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  } catch (error) {
    console.error(error);
    return undefined;
  }

  return await response.json() as SearchQueryResponse[];
};

export default function createBrowse (props: BrowseProps) {
  const [page, setPage] = useState(0);
  const [cards, setCards] = useState(null);
  const [searchResults, setSearchResults] = useState<SearchQueryResponse[] | undefined>(undefined);
  const [searchArguments, setSearchArguments] = useState<SearchRequestArguments>({query: 'torso'});

  const browseContainer = createElement('section', {
    id: contentRootStyles.contentRoot,
  });

  const filterBar = createFilterBar({setSearchArguments});

  const shoppingCardsContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardsContainer,
  );

  const search = async () => {
    const result = await searchForProducts(searchArguments);

    setSearchResults(result);
  };

  useEffect(nameof(createBrowse), () => {
    search();
  }, []);

  useEffect(nameof(createBrowse), () => {
    search();
  }, [searchArguments]);

  let children;

  if (!searchResults) {
    children = createElement('p', {
      textContent: 'Loading...',
    });
  } else if (searchResults && searchResults.length > 0) {
    children = createElement('p', {
      textContent: `${searchResults.length} results fetched`,
    });
  } else {
    children = createElement('p', {
      textContent: 'No results found',
    });
  }

  return htmlx`
    <${browseContainer}>
      <${filterBar}/>
      <${shoppingCardsContainer}>
        <${children}/>
      </shoppingCardsContainer>
    </browseContainer>
  `;
}
