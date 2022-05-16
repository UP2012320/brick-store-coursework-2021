import createFilterBar from 'Scripts/components/filterBar/filterBar';
import createShopCard from 'Scripts/components/shopCard/shopCard';
import {nameof} from 'Scripts/helpers';
import useSearch from 'Scripts/hooks/useSearch';
import htmlx from 'Scripts/htmlX';
import browseStyles from 'Scripts/pages/browse/browse.module.scss';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import contentRootStyles from 'Styles/contentRoot.module.scss';

const key = nameof(createBrowse);
export default function createBrowse(props) {
  const [searchResults, setSearchState, reload, pageNumber, noMoreResults, requestError] = useSearch(key);
  const browseContainer = createKeyedContainer('section', key, undefined, contentRootStyles.contentRoot);
  const filterBar = createFilterBar({setSearchState});
  const shoppingCardsContainer = createElement('div', undefined, browseStyles.shopCardsContainer);
  const shoppingCardsScrollContainer = createElement('div', undefined, browseStyles.shopCardsScrollContainer);
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
  const returnToTopIcon = createElement('i', undefined, browseStyles.biChevronUp);
  const cards = searchResults.map((searchResult) => createShopCard({
    key: searchResult.inventory_id,
    searchResultArgument: searchResult
  }));
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
