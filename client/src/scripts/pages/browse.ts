import createFilterBar from 'Scripts/components/filterBar';
import createShopCard from 'Scripts/components/shopCard';
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

const pageLimit = 20;

export default function createBrowse (props: BrowseProps) {
  const [page, setPage] = useState(1);
  const [cards, setCards] = useState(null);
  const [searchResults, setSearchResults] = useState<SearchQueryResponse[] | undefined>(undefined);
  const [searchArguments, setSearchArguments] = useState<SearchRequestArguments>({query: ''});

  const browseContainer = createElement('section', {
    id: contentRootStyles.contentRoot,
  });

  const filterBar = createFilterBar({setSearchArguments});

  const shoppingCardsContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardsContainer,
  );

  const shoppingCardsScrollContainer = createElementWithStyles('div', undefined, browseStyles.shopCardsScrollContainer);

  const search = async () => {
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
      return;
    }

    const result = await response.json() as SearchQueryResponse[];

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
    children = [];

    const paginatedResults = searchResults.slice(0, page * pageLimit);

    for (const result of paginatedResults) {
      children.push(createShopCard({searchResultArgument: result}));
    }
  } else {
    children = createElement('p', {
      textContent: 'No results found',
    });
  }

  const bottomActionRow = createElement('div', {id: browseStyles.bottomActionsRow});

  const loadMoreButton = createElement('div', {
    id: browseStyles.loadMoreBox,
    onclick: () => {
      setPage((previous) => previous + 1);
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
          <${children}/>
        </shoppingCardsContainer>
        <${searchResults ? bottomActionRow : null}>
          <${loadMoreButton}/>
          <${returnToTopButton}>
            <${returnToTopIcon}/>
          </returnToTopButton>
        </bottomActionRow>
      </shoppingCardsContainer>
    </browseContainer>
  `;
}
