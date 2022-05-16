import createHeaderItem from 'Scripts/components/inventoryTable/headerItem/headerItem';
import inventoryTableStyles from 'Scripts/components/inventoryTable/inventoryTable.module.scss';
import {nameof, type SortSetting} from 'Scripts/helpers';
import {type SetSearchStateArguments} from 'Scripts/hooks/useSearch';
import {type StateSetter, useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement} from 'Scripts/uiUtils';

const key = nameof(createHeaderRow);

interface HeaderRowProps {
  setAddModalIsOpen: StateSetter<boolean>;
  setSearchSettings: (newArguments: SetSearchStateArguments) => void;
  setSortSetting: StateSetter<SortSetting>;
  sortSetting: SortSetting;
}

export default function createHeaderRow (props: HeaderRowProps) {
  const [searchInput, setSearchInput] = useState(key, '');

  const header = createElement('header', undefined, inventoryTableStyles.header);

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

  const headerDateAdded = createHeaderItem({
    key: 'date_added',
    setSortSetting: props.setSortSetting,
    sortBy: 'date_added',
    sortSetting: props.sortSetting,
    styleOverride: 'DateAdded',
    title: 'Date Added',
  });

  const headerVisibility = createHeaderItem({
    key: 'visibility',
    setSortSetting: props.setSortSetting,
    sortBy: 'visibility',
    sortSetting: props.sortSetting,
    styleOverride: 'Visibility',
    title: 'Visible',
  });

  const headerSearch = createElement('div', undefined, inventoryTableStyles.headerSearch);
  const headerSearchBox = createElement('input', {
    defaultValue: searchInput,
    oninput: (event: Event) => {
      const searchValue = (event.target as HTMLInputElement).value;
      setSearchInput(searchValue);
    },
    onkeydown: (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const searchValue = (event.target as HTMLInputElement).value;

        setSearchInput(searchValue);

        props.setSearchSettings({
          newSearchQuery: searchInput,
        });
      }
    },
    placeholder: 'Search',
  }, inventoryTableStyles.headerSearch);

  const headerAdd = createElement('div', undefined, inventoryTableStyles.headerAdd);
  const headerAddButton = createElement('button', {
    onclick: () => {
      props.setAddModalIsOpen(true);
    },
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
    <${headerDateAdded}/>
    <${headerVisibility}/>
    <${headerSearch}>
      <${headerSearchBox}/>
    </${headerSearch}>
    <${headerAdd}>
      <${headerAddButton}/>
    </${headerAdd}>
  </header>
  `;
}
