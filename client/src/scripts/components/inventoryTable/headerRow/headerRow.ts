import createHeaderItem from 'Scripts/components/inventoryTable/headerItem/headerItem';
import inventoryTableStyles from 'Scripts/components/inventoryTable/inventoryTable.module.scss';
import {nameof, type SortSetting} from 'Scripts/helpers';
import {type SetSearchStateArguments} from 'Scripts/hooks/useSearch';
import {type StateSetter, useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';

const key = nameof(createHeaderRow);

interface HeaderRowProps {
  setAddModalIsOpen: StateSetter<boolean>;
  setSearchSettings: (newArguments: SetSearchStateArguments) => void;
  setSortSetting: StateSetter<SortSetting>;
  sortSetting: SortSetting;
}

export default function createHeaderRow (props: HeaderRowProps) {
  const [searchInput, setSearchInput] = useState(key, '');

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

  const headerAdd = createElementWithStyles('div', undefined, inventoryTableStyles.headerAdd);
  const headerAddButton = createElementWithStyles('button', {
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
    <${headerSearch}>
      <${headerSearchBox}/>
    </${headerSearch}>
    <${headerAdd}>
      <${headerAddButton}/>
    </${headerAdd}>
  </header>
  `;
}
