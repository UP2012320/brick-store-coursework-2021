import images from 'Assets/2412b.png';
import {addToCart} from 'Scripts/cartController';
import {formatPercent, formatPrice, getProductUrl} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import browseStyles from 'Styles/pages/browse.module.scss';
import type {Product} from 'api-types';

export interface CreateShopCardProps {
  searchResultArgument: Product;
}

export default function createShopCard (props: CreateShopCardProps) {
  const cardContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardContainer,
  );

  const imageContainer = createElementWithStyles('a', {
    href: getProductUrl(props.searchResultArgument.slug),
  }, browseStyles.shopCardImgHrefContainer);

  registerLinkClickHandler(imageContainer);

  const image = createElementWithStyles(
    'img',
    {
      loading: 'lazy',
      src: images,
    },
    browseStyles.shopCardImg,
  );

  const title = createElementWithStyles(
    'a',
    {
      href: getProductUrl(props.searchResultArgument.slug),
      textContent: props.searchResultArgument.name,
    },
    browseStyles.shopCardTitle,
  );

  registerLinkClickHandler(title);

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
      textContent: formatPrice(props.searchResultArgument.price),
    },
    browseStyles.shopCardPrice,
  );

  let discountedPrice;
  let discountPercentage;

  if (props.searchResultArgument.discount) {
    price.style.textDecoration = 'line-through';

    discountedPrice = createElementWithStyles('p', {
      textContent: formatPrice(props.searchResultArgument.discount_price),
    }, browseStyles.shopCardDiscountedPrice);

    discountPercentage = createElementWithStyles('p', {
      textContent: '(-' + formatPercent(props.searchResultArgument.discount) + ')',
    }, browseStyles.shopCardDiscountPercentage);
  }

  const actionsRow = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardRowActions,
  );

  actionsRow.style.gridArea = 'actionsRow';

  const viewLink = createElementWithStyles('a', {
    href: getProductUrl(props.searchResultArgument.slug),
    textContent: 'View',
  }, browseStyles.shopCardButton);

  registerLinkClickHandler(viewLink);

  const addButton = createElementWithStyles(
    'div',
    {
      onclick: async () => {
        await addToCart(props.searchResultArgument);
      },
      textContent: 'Add to Cart',
    },
    browseStyles.shopCardButton,
  );

  return htmlx`
    <${cardContainer}>
      <${imageContainer}>
        <${image}/>
      </imageContainer>
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
