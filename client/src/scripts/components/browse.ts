import createFilterBar from 'Scripts/components/filterBar';
import createShopCard from 'Scripts/components/shopCard';
import {
  createElement, createElementWithStyles,
} from 'Scripts/uiUtils';
import browseStyles from 'Styles/browse.module.scss';

export default function createBrowse () {
  const container = createElement('section', {
    id: browseStyles.browse,
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

  container.append(filterBar);
  container.append(shoppingCardsContainer);

  return container;
}
