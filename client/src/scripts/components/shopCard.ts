import images from 'Assets/2412b.png';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import browseStyles from 'Styles/pages/browse.module.scss';
import type {SearchQueryResult} from 'api-types';

export interface CreateShopCardProps {
  searchResultArgument: SearchQueryResult;
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
      textContent: `#${props.searchResultArgument.inventory_id.toUpperCase()}`,
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

  stock.style.color = props.searchResultArgument.stock > 0 ? 'green' : 'red';

  const priceRow = createElementWithStyles('div', undefined, browseStyles.shopCardPriceRow);

  const price = createElementWithStyles(
    'p',
    {
      textContent: new Intl.NumberFormat('en-GB',
        {currency: 'GBP', style: 'currency'}).format(props.searchResultArgument.price),
    },
    browseStyles.shopCardPrice,
  );

  let discountedPrice;
  let discountPercentage;

  if (props.searchResultArgument.discount) {
    price.style.textDecoration = 'line-through';

    discountedPrice = createElementWithStyles('p', {
      textContent: new Intl.NumberFormat('en-GB',
        {currency: 'GBP', style: 'currency'}).format(props.searchResultArgument.discount_price),
    }, browseStyles.shopCardDiscountedPrice);

    discountPercentage = createElementWithStyles('p', {
      textContent: '(-' + new Intl.NumberFormat('en-GB',
        {currency: 'GBP', style: 'percent'}).format(props.searchResultArgument.discount) + ')',
    }, browseStyles.shopCardDiscountPercentage);
  }

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
      <${priceRow}>
        <${price}/>
        <${discountedPrice}/>
        <${discountPercentage}/>
      </priceRow>
      <${actionsRow}>
        <${viewLink}/>
        <${addButton}/>
      </actionsRow>
    </cardContainer>
  `;
}
