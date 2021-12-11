import { createElement, createElementWithStyles } from 'Scripts/uiUtils';
import browseStyles from 'Styles/browse.module.scss';
import createShopCard from 'Scripts/components/shopCard';

export default function createBrowse() {
  const container = createElement('div', {
    id: browseStyles.browse,
  });

  const shoppingCards = [];

  for (let i = 0; i < 10; i++) {
    const cardContainer = createElementWithStyles(
      'div',
      undefined,
      browseStyles.shopCardContainer,
    );
    const card = createShopCard();

    cardContainer.append(...card);

    shoppingCards.push(cardContainer);
  }

  container.append(...shoppingCards);

  return container;
}
