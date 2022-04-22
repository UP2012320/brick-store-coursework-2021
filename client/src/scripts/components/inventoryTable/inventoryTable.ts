import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement, createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import inventoryTableStyles from './inventoryTable.module.scss';

const key = nameof(createInventoryTable);

/*
ID NAME COLOUR TYPE PRICE DISCOUNTED_PRICE DISCOUNT STOCK EDIT DELETE

  display: grid;
  grid:
    "id name colour type price discounted_price discount stock edit delete" 1fr
    / 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;

display: grid;
  grid:
    ". name . . . discounted_price . . search add" 1fr
    / 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
 */

export default function createInventoryTable () {
  const container = createKeyedContainer('div', key, undefined, inventoryTableStyles.container);

  const header = createElementWithStyles('header', undefined, inventoryTableStyles.header);

  const headerName = createElementWithStyles('button', undefined, inventoryTableStyles.headerName, inventoryTableStyles.selected);
  const headerNameText = createElement('p', {
    textContent: 'Name',
  });
  const headerNameSortArrow = createElementWithStyles('i', undefined, inventoryTableStyles.biCaretDownFill);

  const headerPrice = createElementWithStyles('button', undefined, inventoryTableStyles.headerPrice);
  const headerPriceText = createElement('p', {
    textContent: 'Price',
  });
  const headerPriceSortArrow = createElementWithStyles('i', undefined, inventoryTableStyles.biCaretDownFill);

  const headerSearch = createElementWithStyles('div', undefined, inventoryTableStyles.headerSearch);
  const headerSearchBox = createElementWithStyles('input', {
    placeholder: 'Search',
  }, inventoryTableStyles.headerSearch);

  const headerAdd = createElementWithStyles('div', undefined, inventoryTableStyles.headerAdd);
  const headerAddButton = createElementWithStyles('button', {
    textContent: 'Add',
  }, inventoryTableStyles.actionButtonNoBorder);

  const body = createElementWithStyles('section', undefined, inventoryTableStyles.body);

  return htmlx`
  <${container}>
    <${header}>
      <${headerName}>
        <${headerNameText}/>
        <${headerNameSortArrow}/>
      </${headerName}>
      <${headerPrice}>
        <${headerPriceText}/>
        <${headerPriceSortArrow}/>
      </${headerPrice}>
      <${headerSearch}>
        <${headerSearchBox}/>
      </${headerSearch}>
      <${headerAdd}>
        <${headerAddButton}/>
      </${headerAdd}>
    </header>
    <${body}>

    </body>
  </container>
  `;
}
