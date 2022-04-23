import createBodyRow from 'Scripts/components/inventoryTable/bodyRow/bodyRow';
import createHeaderRow from 'Scripts/components/inventoryTable/headerRow/headerRow';
import type {SortSetting} from 'Scripts/helpers';
import {nameof} from 'Scripts/helpers';
import type {StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import type {Product} from 'api-types';
import inventoryTableStyles from './inventoryTable.module.scss';

const key = nameof(createInventoryTable);

interface InventoryTableProps {
  rows: Product[];
  setSortSetting: StateSetter<SortSetting>;
  sortSetting: SortSetting;
}

export default function createInventoryTable (props: InventoryTableProps) {
  const container = createKeyedContainer('div', key, undefined, inventoryTableStyles.container);

  const header = createHeaderRow({
    setSortSetting: props.setSortSetting,
    sortSetting: props.sortSetting,
  });

  const body = createElementWithStyles('ul', undefined, inventoryTableStyles.body);

  const rows = props.rows.map((row) => createBodyRow({key: row.inventory_id, row}));

  return htmlx`
  <${container}>
    <${header}/>
    <${body}>
      <${rows}/>
    </body>
  </container>
  `;
}
