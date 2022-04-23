import createHeaderItem from 'Scripts/components/inventoryTable/headerItem/headerItem';
import inventoryTableStyles from 'Scripts/components/inventoryTable/inventoryTable.module.scss';
import type {SortSetting} from 'Scripts/helpers';
import type {StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';

interface HeaderRowProps {
  setSortSetting: StateSetter<SortSetting>;
  sortSetting: SortSetting;
}

export default function createHeaderRow (props: HeaderRowProps) {
  const header = createElementWithStyles('header', undefined, inventoryTableStyles.header);

  const headerId = createHeaderItem({
    key: 'inventory_id',
    setSortSetting: props.setSortSetting,
    sortBy: 'inventory_id',
    sortSetting: props.sortSetting,
    styleOverride: 'Id',
    title: 'ID',
  });

  const headerName = createHeaderItem({
    key: 'item_name',
    setSortSetting: props.setSortSetting,
    sortBy: 'item_name',
    sortSetting: props.sortSetting,
    title: 'Name',
  });

  const headerColour = createHeaderItem({
    key: 'colour',
    setSortSetting: props.setSortSetting,
    sortBy: 'colour',
    sortSetting: props.sortSetting,
    title: 'Colour',
  });

  const headerType = createHeaderItem({
    key: 'type',
    setSortSetting: props.setSortSetting,
    sortBy: 'type',
    sortSetting: props.sortSetting,
    title: 'Type',
  });

  const headerPrice = createHeaderItem({
    key: 'price',
    setSortSetting: props.setSortSetting,
    sortBy: 'price',
    sortSetting: props.sortSetting,
    title: 'Price',
  });

  const headerDiscountedPrice = createHeaderItem({
    key: 'discount_price',
    setSortSetting: props.setSortSetting,
    sortBy: 'discount_price',
    sortSetting: props.sortSetting,
    styleOverride: 'DiscountedPrice',
    title: 'Discounted Price',
  });

  const headerDiscount = createHeaderItem({
    setSortSetting: props.setSortSetting,
    sortBy: 'discount',
    sortSetting: props.sortSetting,
    title: 'Discount',
  });

  const headerStock = createHeaderItem({
    key: 'stock',
    setSortSetting: props.setSortSetting,
    sortBy: 'stock',
    sortSetting: props.sortSetting,
    title: 'Stock',
  });

  const headerSearch = createElementWithStyles('div', undefined, inventoryTableStyles.headerSearch);
  const headerSearchBox = createElementWithStyles('input', {
    placeholder: 'Search',
  }, inventoryTableStyles.headerSearch);

  const headerAdd = createElementWithStyles('div', undefined, inventoryTableStyles.headerAdd);
  const headerAddButton = createElementWithStyles('button', {
    textContent: 'Add',
  }, inventoryTableStyles.actionButtonNoBorder);

  return htmlx`
  <${header}>
    <${headerId}/>
    <${headerName}/>
    <${headerColour}/>
    <${headerType}/>
    <${headerPrice}/>
    <${headerDiscountedPrice}/>
    <${headerDiscount}/>
    <${headerStock}/>
    <${headerSearch}>
      <${headerSearchBox}/>
    </${headerSearch}>
    <${headerAdd}>
      <${headerAddButton}/>
    </${headerAdd}>
  </header>
  `;
}
