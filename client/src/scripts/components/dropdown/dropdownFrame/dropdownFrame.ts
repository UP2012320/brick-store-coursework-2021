import createToggleHeader from 'Scripts/components/toggleHeader/toggleHeader';
import {nameof} from 'Scripts/helpers';
import useFocusLost from 'Scripts/hooks/useFocusLost';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import commonComponentsStyles from 'Styles/commonComponents.module.scss';
import filterBarStyles from 'Styles/components/filterBar.module.scss';
import type {HasBodyProps, ReUsableComponentProps} from 'Types/types';
import dropDownStyles from '../dropdown.module.scss';

export interface DropdownProps extends ReUsableComponentProps, HasBodyProps {
  title: string;
}

export default function createDropdown (props: DropdownProps) {
  props.key ??= nameof(createDropdown);

  const [toggled, setToggled] = useState(props.key, false);
  useFocusLost(props.key, `.${dropDownStyles.dropdownContainer}[key="${props.key}"]`, () => {
    setToggled(false);
  });

  const rowItem = createElementWithStyles('div', undefined, filterBarStyles.filterBarOptionsRowItem);

  const dropdownToggleHeader = createToggleHeader({
    key: `${props.key}-toggle-header`,
    setToggled,
    title: props.title,
    toggled,
  });

  const dropDownContainer = createKeyedContainer('div', props.key, undefined, dropDownStyles.dropdownContainer);

  const dropDownBodyContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionsContainer);

  const overlay = createElementWithStyles('div', undefined, dropDownStyles.overlay);

  if (toggled) {
    dropDownBodyContainer.classList.add(dropDownStyles.dropdownOpen);
    overlay.classList.remove(commonComponentsStyles.hidden);
  } else {
    dropDownBodyContainer.classList.remove(dropDownStyles.dropdownOpen);
    overlay.classList.add(commonComponentsStyles.hidden);
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
