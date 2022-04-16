import createFilterBar from 'Scripts/components/filterBar/filterBar';
import createShopCard from 'Scripts/components/shopCard';
import {nameof} from 'Scripts/helpers';
import useSearch from 'Scripts/hooks/useSearch';
import htmlx from 'Scripts/htmlX';
import {createElement, createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/components/contentRoot.module.scss';
import browseStyles from 'Styles/pages/browse.module.scss';

export interface BrowseProps {
  queryStrings?: Record<string, string>;
}

const key = nameof(createBrowse);

export default function createBrowse (props: BrowseProps) {
  const [searchResults, setSearchState, pageNumber, noMoreResults, requestError] = useSearch(key);

  console.debug(searchResults);

  const browseContainer = createKeyedContainer('section', key, undefined, contentRootStyles.contentRoot);

  const filterBar = createFilterBar({setSearchState});

  const shoppingCardsContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardsContainer,
  );

  const shoppingCardsScrollContainer = createElementWithStyles('div', undefined, browseStyles.shopCardsScrollContainer);

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
      setSearchState({
        newPage: pageNumber + 1,
      });
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

  const cards = searchResults.map((searchResult) => createShopCard({key: searchResult.inventory_id, searchResultArgument: searchResult}));

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
