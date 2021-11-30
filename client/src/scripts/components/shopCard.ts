import {createElementWithStyles} from 'Scripts/uiUtils';
import styles from 'Styles/browse.module.scss';
import images from 'Assets/2412b.png';

export default function createShopCard() {
  const image = createElementWithStyles('img', {
    src: images,
    loading: 'lazy',
  }, styles.shopCardImg);

  const title = createElementWithStyles('p', {
    textContent: 'Lego Brick #1',
  }, styles.shopCardTitle);

  const idStockRow = createElementWithStyles('div', undefined, styles.shopCardRowId);

  idStockRow.style.gridArea = 'idRow';

  const id = createElementWithStyles('p', {
    textContent: '#E438OR',
  }, styles.shopCardId);

  const stock = createElementWithStyles('p', {
    textContent: '4+ Stock',
  }, styles.shopCardStock);

  const price = createElementWithStyles('p', {
    textContent: '£0.10'
  }, styles.shopCardPrice);

  const actionsRow = createElementWithStyles('div', undefined, styles.shopCardRowActions);

  actionsRow.style.gridArea = 'actionsRow';

  const viewButton = createElementWithStyles('div', {
    textContent: 'View'
  }, styles.shopCardButton);

  const addButton = createElementWithStyles('div', {
    textContent: 'Add'
  }, styles.shopCardButton);

  idStockRow.appendChild(id);
  idStockRow.appendChild(stock);

  actionsRow.appendChild(viewButton);
  actionsRow.appendChild(addButton);

  return [
    image,
    title,
    idStockRow,
    price,
    actionsRow
  ];
}
