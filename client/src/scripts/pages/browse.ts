import createFilterBar from 'Scripts/components/filterBar/filterBar';
import createShopCard from 'Scripts/components/shopCard';
import {nameof, serverBaseUrl} from 'Scripts/helpers';
import {registerUseEffect} from 'Scripts/hooks/useEffect';
import {registerUseRef} from 'Scripts/hooks/useRef';
import {registerUseState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/components/contentRoot.module.scss';
import browseStyles from 'Styles/pages/browse.module.scss';
import type {SearchQueryResponse, SearchRequestArguments} from 'api-types';

export interface BrowseProps {
  queryStrings?: Record<string, string>;
}

const key = nameof(createBrowse);
const useState = registerUseState(key);
const useEffect = registerUseEffect(key);
const useRef = registerUseRef(key);
const maxSearchResults = 50;

export default function createBrowse (props: BrowseProps) {
  const [searchResults, setSearchResults] = useState<SearchQueryResponse | undefined>(undefined);
  const [searchArguments, setSearchArguments] = useState<SearchRequestArguments>({query: ''});
  const [noMoreResults, setNoMoreResults] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const page = useRef(0);
  const isNewSearch = useRef(true);

  const browseContainer = createKeyedContainer('section', key, undefined, contentRootStyles.contentRoot);

  const filterBar = createFilterBar({setFilters, setSearchArguments});

  const shoppingCardsContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardsContainer,
  );

  const shoppingCardsScrollContainer = createElementWithStyles('div', undefined, browseStyles.shopCardsScrollContainer);

  const search = async () => {
    setNoMoreResults(false);

    const url = new URL('/api/v1/search', serverBaseUrl);
    url.searchParams.set('query', searchArguments.query);
    url.searchParams.set('offset', (page.current * maxSearchResults).toString());

    for (const [filterKey, value] of Object.entries(filters)) {
      if (value.length > 1) {
        url.searchParams.set(filterKey, value.join(','));
      } else if (value.length === 1) {
        url.searchParams.set(filterKey, value[0]);
      }
    }

    let response: Response;

    try {
      response = await fetch(url.href);
    } catch (error) {
      console.error(error);
      return;
    }

    const result = await response.json() as SearchQueryResponse;

    if (result.results.length < maxSearchResults) {
      setNoMoreResults(true);
    }

    page.current += 1;
    // eslint-disable-next-line require-atomic-updates
    setSearchResults((previousSearchResults) => {
      if (previousSearchResults?.results && !isNewSearch.current) {
        return {
          results: [...previousSearchResults.results, ...result.results],
        };
      } else {
        isNewSearch.current = false;
        return {
          results: [...result.results],
        };
      }
    });
  };

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    page.current = 0;
    isNewSearch.current = true;
    search();
  }, [searchArguments, filters]);

  let statusMessage;

  if (noMoreResults) {
    statusMessage = createElement('p', {
      textContent: 'No more results found',
    });
  } else {
    statusMessage = createElement('p', {
      textContent: 'Loading...',
    });
  }

  const bottomActionRow = createElement('div', {id: browseStyles.bottomActionsRow});

  const loadMoreButton = createElement('div', {
    id: browseStyles.loadMoreBox,
    onclick: () => {
      search();
    },
    textContent: 'Load More',
  });

  const returnToTopButton = createElement('div', {
    id: browseStyles.returnToTopButton,
    onclick: () => scrollTo({
      behavior: 'smooth',
      left: 0,
      top: 0,
    }),
  });

  const returnToTopIcon = createElementWithStyles('i', undefined, browseStyles.biChevronUp);

  const cards = searchResults?.results.map((searchResult) => createShopCard({key: searchResult.inventory_id, searchResultArgument: searchResult}));

  return htmlx`
    <${browseContainer}>
      <${filterBar}/>
      <${shoppingCardsScrollContainer}>
        <${shoppingCardsContainer}>
          <${cards ? cards : statusMessage}/>
        </shoppingCardsContainer>
        <${cards ? bottomActionRow : null}>
          <${noMoreResults ? statusMessage : null}/>
          <${noMoreResults ? null : loadMoreButton}/>
          <${returnToTopButton}>
            <${returnToTopIcon}/>
          </returnToTopButton>
        </bottomActionRow>
      </shoppingCardsContainer>
    </browseContainer>
  `;
}
