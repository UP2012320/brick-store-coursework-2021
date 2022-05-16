import createBodyRow from 'Scripts/components/inventoryTable/bodyRow/bodyRow';
import createHeaderRow from 'Scripts/components/inventoryTable/headerRow/headerRow';
import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import inventoryTableStyles from './inventoryTable.module.scss';

const key = nameof(createInventoryTable);
export default function createInventoryTable(props) {
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
