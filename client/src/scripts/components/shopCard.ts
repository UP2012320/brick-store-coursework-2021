import images from 'Assets/2412b.png';
import {createElementWithStyles} from 'Scripts/uiUtils';
import styles from 'Styles/browse.module.scss';

export default function createShopCard () {
  const image = createElementWithStyles(
    'img',
    {
      loading: 'lazy',
      src: images,
    },
    styles.shopCardImg,
  );

  const title = createElementWithStyles(
    'p',
    {
      textContent: 'Lego Brick #1',
    },
    styles.shopCardTitle,
  );

  const idStockRow = createElementWithStyles(
    'div',
    undefined,
    styles.shopCardRowId,
  );

  idStockRow.style.gridArea = 'idRow';

  const id = createElementWithStyles(
    'p',
    {
      textContent: '#E438O-RF2HE',
    },
    styles.shopCardId,
  );

  const stock = createElementWithStyles(
    'p',
    {
      textContent: '4+ Stock',
    },
    styles.shopCardStock,
  );

  const price = createElementWithStyles(
    'p',
    {
      textContent: '£0.10',
    },
    styles.shopCardPrice,
  );

  const actionsRow = createElementWithStyles(
    'div',
    undefined,
    styles.shopCardRowActions,
  );

  actionsRow.style.gridArea = 'actionsRow';

  const viewButton = createElementWithStyles(
    'div',
    {
      textContent: 'View',
    },
    styles.shopCardButton,
  );

  const addButton = createElementWithStyles(
    'div',
    {
      textContent: 'Add',
    },
    styles.shopCardButton,
  );

  idStockRow.append(id, stock);

  actionsRow.append(viewButton, addButton);

  return [image, title, idStockRow, price, actionsRow];
}
