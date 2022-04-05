import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/components/filterBar.module.scss';
import type {HasBodyProps, ReUsableComponentProps} from 'Types/types';
import dropDownStyles from '../dropdown.module.scss';

export interface DropdownFrameProps extends ReUsableComponentProps, HasBodyProps {
  title: string;
}

export default function createDropdownFrame (props: DropdownFrameProps) {
  props.key ??= nameof(createDropdownFrame);

  const [toggled, setToggled] = useState(props.key, false);

  const rowItem = createElementWithStyles('div', undefined, filterBarStyles.filterBarOptionsRowItem);

  const dropDownContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownContainer);
  dropDownContainer.setAttribute('key', props.key);

  const dropDownTitleRow = createElementWithStyles('div', {
    onclick: () => {
      setToggled((previous) => !previous);
    },
  }, dropDownStyles.dropdownTitleRow);

  const dropDownSelectedOption = createElementWithStyles('p',
    {textContent: props.title},
    dropDownStyles.dropdownTitle);

  const dropDownToggleArrow = createElementWithStyles('div', undefined, dropDownStyles.biCaretDownFill);

  const dropDownBodyContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionsContainer);

  const onOutsideClick = (event: MouseEvent) => {
    const dropDownOptionsContainerMouseEvent = document.querySelector(`.${dropDownStyles.dropdownContainer}`);

    if (!dropDownOptionsContainerMouseEvent?.contains(event.target as HTMLElement)) {
      setToggled(false);
    }
  };

  useEffect(props.key, () => {
    document.body.addEventListener('click', onOutsideClick);
    return () => document.removeEventListener('click', onOutsideClick);
  }, []);

  if (toggled) {
    dropDownTitleRow.classList.add(dropDownStyles.open);
    dropDownBodyContainer.classList.add(dropDownStyles.dropdownOpen);
    dropDownToggleArrow.classList.add(dropDownStyles.dropdownOpen);
  } else {
    dropDownTitleRow.classList.remove(dropDownStyles.open);
    dropDownBodyContainer.classList.remove(dropDownStyles.dropdownOpen);
    dropDownToggleArrow.classList.remove(dropDownStyles.dropdownOpen);
  }

  return htmlx`
  <${rowItem}>
    <${dropDownContainer}>
      <${dropDownTitleRow}>
        <${dropDownSelectedOption}/>
        <${dropDownToggleArrow}/>
      </dropDownTitleRow>
      <${dropDownBodyContainer}>
        <${props.body}/>
      </dropDownBodyContainer>
    </dropDownContainer>
  </rowItem>
  `;
}
