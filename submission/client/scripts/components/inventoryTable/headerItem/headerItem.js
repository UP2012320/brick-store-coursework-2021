/* eslint-disable @typescript-eslint/dot-notation */
import inventoryTableStyles from 'Scripts/components/inventoryTable/inventoryTable.module.scss';
import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';

export default function createHeaderItem(props) {
  props.key ??= nameof(createHeaderItem);
  const headerContainer = createKeyedContainer('button', props.key, {
    onclick: () => props.setSortSetting((previous) => previous.updateSortBy(props.sortBy)),
  }, inventoryTableStyles[`header${props.styleOverride ? props.styleOverride : props.title}`]);
  const headerText = createElement('p', {
    textContent: props.title,
  });
  const headerContainerSortArrow = createElement('i', undefined, inventoryTableStyles.biCaretDownFill);
  if (props.sortSetting.sortBy === props.sortBy) {
    headerContainer.classList.add(inventoryTableStyles.selected);
    if (props.sortSetting.sortOrder === 'desc') {
      headerContainer.classList.add(inventoryTableStyles.toggled);
    }
  }
  return htmlx`
  <${headerContainer}>
    <${headerText} />
    <${headerContainerSortArrow} />
  </${headerContainer}>
  `;
}
