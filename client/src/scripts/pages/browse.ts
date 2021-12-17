import createFilterBar from 'Scripts/components/filterBar';
import createShopCard from 'Scripts/components/shopCard';
import {createElement, createElementWithStyles} from 'Scripts/uiUtils';
import browseStyles from 'Styles/browse.module.scss';
import contentRootStyles from 'Styles/contentRoot.module.scss';

export default function createBrowse () {
  const browseContainer = createElement('section', {
    id: contentRootStyles.contentRoot,
  });

  const filterBar = createFilterBar();

  const shoppingCardsContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardsContainer,
  );

  const shoppingCards = [];

  for (let index = 0; index < 10; index++) {
    const cardContainer = createElementWithStyles(
      'div',
      undefined,
      browseStyles.shopCardContainer,
    );
    const card = createShopCard();

    cardContainer.append(...card);

    shoppingCards.push(cardContainer);
  }

  shoppingCardsContainer.append(...shoppingCards);

  browseContainer.append(filterBar);
  browseContainer.append(shoppingCardsContainer);

  return browseContainer;
}
