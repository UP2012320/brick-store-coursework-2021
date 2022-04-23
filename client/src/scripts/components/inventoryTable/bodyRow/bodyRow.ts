import inventoryTableStyles from 'Scripts/components/inventoryTable/inventoryTable.module.scss';
import {formatPercent, formatPrice, nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import type {ReUsableComponentProps} from 'Types/types';
import type {Product} from 'api-types';

interface BodyRowProps extends ReUsableComponentProps {
  row: Product;
}

export default function createBodyRow (props: BodyRowProps) {
  props.key ??= nameof(createBodyRow);

  const bodyRow = createKeyedContainer('li', props.key, undefined, inventoryTableStyles.bodyRow);

  const bodyId = createElementWithStyles('div', {
    textContent: props.row.inventory_id.toUpperCase(),
  }, inventoryTableStyles.bodyRowId);

  const bodyName = createElementWithStyles('div', {
    textContent: props.row.name,
  }, inventoryTableStyles.bodyRowName);

  const bodyColour = createElementWithStyles('div', {
    textContent: props.row.colour,
  }, inventoryTableStyles.bodyRowColour);

  const bodyType = createElementWithStyles('div', {
    textContent: props.row.type,
  }, inventoryTableStyles.bodyRowType);

  const bodyPrice = createElementWithStyles('div', {
    textContent: formatPrice(props.row.price),
  }, inventoryTableStyles.bodyRowPrice);

  const bodyDiscountedPrice = createElementWithStyles('div', {
    textContent: formatPrice(props.row.discount_price),
  }, inventoryTableStyles.bodyRowDiscountedPrice);

  const bodyDiscount = createElementWithStyles('div', {
    textContent: formatPercent(props.row.discount ?? 0),
  }, inventoryTableStyles.bodyRowDiscount);

  const bodyStock = createElementWithStyles('div', {
    textContent: (props.row.stock ?? 0).toString(),
  }, inventoryTableStyles.bodyRowStock);

  const bodyEdit = createElementWithStyles('div', undefined, inventoryTableStyles.bodyRowEdit);

  const bodyDelete = createElementWithStyles('div', undefined, inventoryTableStyles.bodyRowDelete);

  return htmlx`
    <${bodyRow}>
      <${bodyId}/>
      <${bodyName}/>
      <${bodyColour}/>
      <${bodyType}/>
      <${bodyPrice}/>
      <${bodyDiscountedPrice}/>
      <${bodyDiscount}/>
      <${bodyStock}/>
      <${bodyEdit}/>
      <${bodyDelete}/>
    </bodyRow>
    `;
}
