import images from 'Assets/2412b.png';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import browseStyles from 'Styles/pages/browse.module.scss';
import type {SearchQueryResponse} from 'api-types';

export interface CreateShopCardProps {
  searchResultArgument: SearchQueryResponse;
}

export default function createShopCard (props: CreateShopCardProps) {
  const cardContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardContainer,
  );

  const image = createElementWithStyles(
    'img',
    {
      loading: 'lazy',
      src: images,
    },
    browseStyles.shopCardImg,
  );

  const title = createElementWithStyles(
    'p',
    {
      textContent: props.searchResultArgument.name,
    },
    browseStyles.shopCardTitle,
  );

  const idStockRow = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardRowId,
  );

  idStockRow.style.gridArea = 'idRow';

  const id = createElementWithStyles(
    'p',
    {
      textContent: `#${props.searchResultArgument.id.toUpperCase()}`,
    },
    browseStyles.shopCardId,
  );

  const stock = createElementWithStyles(
    'p',
    {
      textContent: `${props.searchResultArgument.stock} in Stock`,
    },
    browseStyles.shopCardStock,
  );

  const price = createElementWithStyles(
    'p',
    {
      textContent: new Intl.NumberFormat('en-GB', {currency: 'GBP', style: 'currency'}).format(props.searchResultArgument.price),
    },
    browseStyles.shopCardPrice,
  );

  const actionsRow = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardRowActions,
  );

  actionsRow.style.gridArea = 'actionsRow';

  const viewLink = createElementWithStyles('a', {
    href: `/product/${props.searchResultArgument.slug}`,
    textContent: 'View',
  }, browseStyles.shopCardButton);

  const addButton = createElementWithStyles(
    'div',
    {
      textContent: 'Add to Cart',
    },
    browseStyles.shopCardButton,
  );

  return htmlx`
    <${cardContainer}>
      <${image}/>
      <${title}/>
      <${idStockRow}>
        <${id}/>
        <${stock}/>
      </idStockRow>
      <${price}/>
      <${actionsRow}>
        <${viewLink}/>
        <${addButton}/>
      </actionsRow>
    </cardContainer>
  `;
}
