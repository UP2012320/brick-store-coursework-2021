import images from 'Assets/2412b.png';
import html from 'Scripts/htmlTemplate';
import {createElementWithStyles} from 'Scripts/uiUtils';
import browseStyles from 'Styles/pages/browse.module.scss';

export default function createShopCard () {
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
      textContent: 'Lego Brick #1',
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
      textContent: '#E438O-RF2HE',
    },
    browseStyles.shopCardId,
  );

  const stock = createElementWithStyles(
    'p',
    {
      textContent: '4+ Stock',
    },
    browseStyles.shopCardStock,
  );

  const price = createElementWithStyles(
    'p',
    {
      textContent: '£0.10',
    },
    browseStyles.shopCardPrice,
  );

  const actionsRow = createElementWithStyles(
    'div',
    undefined,
    browseStyles.shopCardRowActions,
  );

  actionsRow.style.gridArea = 'actionsRow';

  const viewButton = createElementWithStyles(
    'div',
    {
      textContent: 'View',
    },
    browseStyles.shopCardButton,
  );

  const addButton = createElementWithStyles(
    'div',
    {
      textContent: 'Add',
    },
    browseStyles.shopCardButton,
  );

  return html`
    <${cardContainer}>
      <${image}/>
      <${title}/>
      <${idStockRow}>
        <${id}/>
        <${stock}/>
      </idStockRow>
      <${price}/>
      <${actionsRow}>
        <${viewButton}/>
        <${addButton}/>
      </actionsRow>
    </cardContainer>
  `;
}
