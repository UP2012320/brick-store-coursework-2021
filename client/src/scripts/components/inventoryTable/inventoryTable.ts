import createBodyRow from 'Scripts/components/inventoryTable/bodyRow/bodyRow';
import createHeaderRow from 'Scripts/components/inventoryTable/headerRow/headerRow';
import {nameof, type SortSetting} from 'Scripts/helpers';
import {type SetSearchStateArguments} from 'Scripts/hooks/useSearch';
import {type StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import {type Product} from 'api-types';
import inventoryTableStyles from './inventoryTable.module.scss';

const key = nameof(createInventoryTable);

interface InventoryTableProps {
  reloadResults: () => void;
  rows: Product[];
  setAddModalIsOpen: StateSetter<boolean>;
  setEditModalIsOpen: StateSetter<boolean>;
  setProductToEdit: StateSetter<Product>;
  setSearchSettings: (newArguments: SetSearchStateArguments) => void;
  setSortSetting: StateSetter<SortSetting>;
  sortSetting: SortSetting;
}

export default function createInventoryTable (props: InventoryTableProps) {
  const container = createKeyedContainer('div', key, undefined, inventoryTableStyles.container);

  const header = createHeaderRow({
    setAddModalIsOpen: props.setAddModalIsOpen,
    setSearchSettings: props.setSearchSettings,
    setSortSetting: props.setSortSetting,
    sortSetting: props.sortSetting,
  });

  const body = createElement('ul', undefined, inventoryTableStyles.body);

  const rows = props.rows.map((row) => createBodyRow({
    key: row.inventory_id,
    reloadResults: props.reloadResults,
    row,
    setEditModalIsOpen: props.setEditModalIsOpen,
    setProductToEdit: props.setProductToEdit,
  }));

  return htmlx`
  <${container}>
    <${header}/>
    <${body}>
      <${rows}/>
    </body>
  </container>
  `;
}
