import createFilterBar from 'Scripts/components/filterBar';
import createShopCard from 'Scripts/components/shopCard';
import {nameof, serverBaseUrl} from 'Scripts/helpers';
import {registerUseEffect} from 'Scripts/hooks/useEffect';
import {useRef} from 'Scripts/hooks/useRef';
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
const useEffect = registerUseEffect(nameof(createBrowse));

export default function createBrowse (props: BrowseProps) {
  const [cards, setCards] = useState<Array<HTMLElement | null> | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<SearchQueryResponse | undefined>(undefined);
  const [searchArguments, setSearchArguments] = useState<SearchRequestArguments>({query: ''});
  const [noMoreResults, setNoMoreResults] = useState(false);
  const page = useRef(nameof(createBrowse), 0);
  const isNewSearch = useRef(nameof(createBrowse), true);

  const browseContainer = createElementWithStyles('section', undefined, contentRootStyles.contentRoot);
  browseContainer.setAttribute('key', nameof(createBrowse));

  const filterBar = createFilterBar({setSearchArguments});

  const shoppingCardsContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardsContainer,
  );

  const shoppingCardsScrollContainer = createElementWithStyles('div', undefined, browseStyles.shopCardsScrollContainer);

  const search = async () => {
    const url = new URL('/api/v1/search', serverBaseUrl);
    url.searchParams.set('query', searchArguments.query);
    url.searchParams.set('offset', (page.current * 50).toString());

    let response: Response;

    try {
      response = await fetch(url.href);
    } catch (error) {
      console.error(error);
      return;
    }

    const result = await response.json() as SearchQueryResponse;

    page.current += 1;
    // eslint-disable-next-line require-atomic-updates
    setSearchResults(result);
  };

  useEffect(() => {
    search();
  }, []);

  useEffect(() => {
    page.current = 0;
    isNewSearch.current = true;
    search();
  }, [searchArguments]);

  useEffect(() => {
    if (searchResults) {
      setCards((previous) => {
        const newCards = [...searchResults.results.map((searchResult) => createShopCard({key: searchResult.inventory_id, searchResultArgument: searchResult}))];

        if (previous && !isNewSearch.current) {
          return [
            ...previous,
            ...newCards,
          ];
        } else {
          isNewSearch.current = false;
          return newCards;
        }
      });
    }
  }, [searchResults]);

  let statusMessage;

  if (cards && searchResults && searchResults.results.length === 0) {
    setNoMoreResults(true);
  } else if (searchResults && searchResults.results.length === 0) {
    statusMessage = createElement('p', {
      textContent: 'No results found',
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

  return htmlx`
    <${browseContainer}>
      <${filterBar}/>
      <${shoppingCardsScrollContainer}>
        <${shoppingCardsContainer}>
          <${cards ? cards : statusMessage}/>
        </shoppingCardsContainer>
        <${cards ? bottomActionRow : null}>
          <${noMoreResults ? null : loadMoreButton}/>
          <${returnToTopButton}>
            <${returnToTopIcon}/>
          </returnToTopButton>
        </bottomActionRow>
      </shoppingCardsContainer>
    </browseContainer>
  `;
}
