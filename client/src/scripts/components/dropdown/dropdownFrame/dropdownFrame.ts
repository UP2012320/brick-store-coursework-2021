import createToggleHeader from 'Scripts/components/toggleHeader/toggleHeader';
import {nameof} from 'Scripts/helpers';
import useOverlay from 'Scripts/hooks/useOverlay';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/components/filterBar.module.scss';
import {type HasBodyProps, type ReUsableComponentProps} from 'Types/types';
import dropDownStyles from '../dropdown.module.scss';

export interface DropdownProps extends ReUsableComponentProps, HasBodyProps {
  title: string;
}

export default function createDropdown (props: DropdownProps) {
  props.key ??= nameof(createDropdown);

  const [overlay, toggled, setToggled] = useOverlay(props.key, false, undefined, 768);

  const rowItem = createElement('div', undefined, filterBarStyles.filterBarOptionsRowItem);

  const dropdownToggleHeader = createToggleHeader({
    key: `${props.key}-toggle-header`,
    setToggled,
    title: props.title,
    toggled,
  });

  const dropDownContainer = createKeyedContainer('div', props.key, undefined, dropDownStyles.dropdownContainer);

  const dropDownBodyContainer = createElement('div', undefined, dropDownStyles.dropdownOptionsContainer);

  if (toggled) {
    dropDownBodyContainer.classList.add(dropDownStyles.dropdownOpen);
  } else {
    dropDownBodyContainer.classList.remove(dropDownStyles.dropdownOpen);
  }

  return htmlx`
  <${rowItem}>
    <${dropDownContainer}>
      <${dropdownToggleHeader}/>
      <${dropDownBodyContainer}>
        <${props.body}/>
      </dropDownBodyContainer>
    </dropDownContainer>
    <${overlay}/>
  </rowItem>
  `;
}
