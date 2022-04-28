import {getAuthorizationHeader} from 'Scripts/auth0';
import inventoryTableStyles from 'Scripts/components/inventoryTable/inventoryTable.module.scss';
import {formatPercent, formatPrice, nameof, SERVER_BASE} from 'Scripts/helpers';
import {type StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import {type ReUsableComponentProps} from 'Types/types';
import {type Product} from 'api-types';

interface BodyRowProps extends ReUsableComponentProps {
  reloadResults: () => void;
  row: Product;
  setEditModalIsOpen: StateSetter<boolean>;
  setProductToEdit: StateSetter<Product>;
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

  const bodyDateAdded = createElementWithStyles('div', {
    textContent: new Date(props.row.date_added).toLocaleString(navigator.languages[0]),
  }, inventoryTableStyles.bodyRowDateAdded);

  const bodyVisibility = createElementWithStyles('div', {
    textContent: props.row.visibility ? 'Yes' : 'No',
  }, inventoryTableStyles.bodyRowVisibility);

  const bodyEdit = createElementWithStyles('button', {
    onclick: () => {
      props.setProductToEdit(props.row);
      props.setEditModalIsOpen(true);
    },
    textContent: 'Edit',
  }, inventoryTableStyles.bodyRowEdit);

  const onDelete = async () => {
    const url = new URL(`/api/v1/staff/products/${props.row.inventory_id}`, SERVER_BASE);

    let response;

    try {
      response = await fetch(url.href, {
        headers: await getAuthorizationHeader(),
        method: 'DELETE',
      });
    } catch (error) {
      console.error(error);
      return;
    }

    if (response.ok) {
      props.reloadResults();
    }
  };

  const bodyDelete = createElementWithStyles('button', {
    onclick: () => onDelete(),
    textContent: 'Delete',
  }, inventoryTableStyles.bodyRowDelete);

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
      <${bodyDateAdded}/>
      <${bodyVisibility}/>
      <${bodyEdit}/>
      <${bodyDelete}/>
    </bodyRow>
    `;
}
