import {appendAllNodes, createElement, createElementWithStyles} from 'Scripts/uiUtils';
import browseStyles from 'Styles/browse.module.scss';
import createShopCard from 'Scripts/components/shopCard';

export default function createBrowse() {
  const container = createElement('div', {
    id: browseStyles.browse
  });

  const shoppingCards = [];

  for (let i = 0; i < 10; i++) {
    const cardContainer = createElementWithStyles('div', undefined, browseStyles.shopCardContainer);
    const card = createShopCard();

    appendAllNodes(cardContainer, card);

    shoppingCards.push(cardContainer);
  }

  appendAllNodes(container, shoppingCards);

  return container;
}
