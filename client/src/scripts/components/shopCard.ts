import {addToCart} from 'Scripts/cartController';
import {formatPercent, formatPrice, getImageUrl, getProductUrl, nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import actionButtonStyles from 'Styles/commonComponents.module.scss';
import browseStyles from 'Styles/pages/browse.module.scss';
import {type ReUsableComponentProps} from 'Types/types';
import {type Product} from 'api-types';

export interface CreateShopCardProps extends ReUsableComponentProps {
  searchResultArgument: Product;
}

export default function createShopCard (props: CreateShopCardProps) {
  props.key ??= nameof(createShopCard);

  const cardContainer = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardContainer,
  );

  cardContainer.setAttribute('key', props.key);

  const imageContainer = createElementWithStyles('a', {
    href: getProductUrl(props.searchResultArgument.slug),
  }, browseStyles.shopCardImgHrefContainer);

  registerLinkClickHandler(imageContainer);

  let image;

  if (props.searchResultArgument.images) {
    image = createElementWithStyles(
      'img',
      {
        loading: 'lazy',
        src: getImageUrl(props.searchResultArgument.images[0]),
      },
      browseStyles.shopCardImg,
    );
  }

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
  }, actionButtonStyles.actionButton);

  registerLinkClickHandler(viewLink);

  const addButton = createElementWithStyles(
    'div',
    {
      onclick: async () => {
        await addToCart(props.searchResultArgument);
      },
      textContent: 'Add to Cart',
    },
    actionButtonStyles.actionButton,
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
