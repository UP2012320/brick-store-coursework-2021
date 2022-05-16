/* eslint-disable @typescript-eslint/dot-notation */
import inventoryTableStyles from 'Scripts/components/inventoryTable/inventoryTable.module.scss';
import {nameof, type SortSetting} from 'Scripts/helpers';
import {type StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import {type ReUsableComponentProps} from 'Types/types';

interface HeaderItemProps extends ReUsableComponentProps {
  setSortSetting: StateSetter<SortSetting>;
  sortBy: string;
  sortSetting: SortSetting;
  styleOverride?: string;
  title: string;
}

export default function createHeaderItem (props: HeaderItemProps) {
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
