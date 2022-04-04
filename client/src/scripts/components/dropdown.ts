import {nameof} from 'Scripts/helpers';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import dropDownStyles from 'Styles/components/dropdown.module.scss';
import type {ReUsableComponentProps} from 'Types/types';

interface DropDownOption {
  name: string;
  toggled: boolean;
  value: string;
}

export interface createDropDownProps<T> extends ReUsableComponentProps {
  onselect: (valueSelected: [string, T]) => void;
  options: DropDownOption[];
}

export default function createDropDown<T> (props: createDropDownProps<T>) {
  props.key ??= nameof(createDropDown);

  const [dropDownToggle, setDropDownToggle] = useState(props.key, false);
  const [options, setOptions] = useState(props.key, props.options);

  const dropDownContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownContainer);
  dropDownContainer.setAttribute('key', props.key);

  const dropDownSelectedRow = createElementWithStyles('div', {
    onclick: () => {
      setDropDownToggle((previous) => !previous);
    },
  }, dropDownStyles.dropdownTitleRow);

  const dropDownSelectedOption = createElementWithStyles('p',
    {textContent: 'test'},
    dropDownStyles.dropdownTitle);

  const dropDownToggleArrow = createElementWithStyles('div', undefined, dropDownStyles.biCaretDownFill);

  const dropDownOptionsContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionsContainer);

  if (dropDownToggle) {
    dropDownOptionsContainer.classList.add(dropDownStyles.dropdownOpen);
    dropDownToggleArrow.classList.add(dropDownStyles.dropdownOpen);
  } else {
    dropDownOptionsContainer.classList.remove(dropDownStyles.dropdownOpen);
    dropDownToggleArrow.classList.remove(dropDownStyles.dropdownOpen);
  }

  const dropDownOptionHeader = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionHeader);

  const dropDownOptionHeaderSelectedCount = createElementWithStyles('p', {
    textContent: '0 Selected',
  }, dropDownStyles.dropdownOptionHeaderSelected);

  const dropDownOptionHeaderSelectAll = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionHeaderSelectAll);

  const dropDownOptionHeaderSelectedTitle = createElementWithStyles('p', {
    textContent: 'All',
  }, dropDownStyles.dropdownOptionHeaderSelectAllTitle);

  const dropDownOptionHeaderSelectAllCheckbox = createElementWithStyles('i', undefined, dropDownStyles.biCheck);

  const dropDownSearchOptionContainer = createElementWithStyles('div',
    undefined,
    dropDownStyles.dropdownSearchOptionContainer);

  const dropDownSearchOption = createElementWithStyles('input',
    {placeholder: 'Search'},
    dropDownStyles.dropdownOptionText);

  const dropDownSelectOptionsContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionsContainer);

  const dropDownOptions = [];

  for (const option of props.options) {
    const dropDownOptionContainer = createElementWithStyles('div', {
      onclick: () => setOptions((previous) => {
        console.debug(previous);

        const newOptions = [...previous];
        const index = newOptions.findIndex((newOption) => newOption.name === option.name);
        newOptions[index].toggled = !newOptions[index].toggled;

        console.debug(newOptions);

        return newOptions;
      }),
    }, dropDownStyles.dropdownOptionContainer);
    const dropDownCheck = createElementWithStyles('i', undefined, dropDownStyles.biCheck);
    const dropDownTick = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionCheckbox);

    if (!option.toggled) {
      dropDownTick.classList.add(dropDownStyles.hidden);
    }

    const dropDownOption = createElementWithStyles('div', {textContent: option.name}, dropDownStyles.dropdownOptionText);

    dropDownOptions.push(htmlx`
    <${dropDownOptionContainer}>
       <${dropDownTick}>
         <${dropDownCheck}/>
       </dropDownTick>
       <${dropDownOption}/>
     </dropDownOptionContainer>
    `);
  }

  return htmlx`
  <${dropDownContainer}>
      <${dropDownSelectedRow}>
        <${dropDownSelectedOption}/>
        <${dropDownToggleArrow}/>
      </dropDownSelectedRow>
      <${dropDownOptionsContainer}>
        <${dropDownOptionHeader}>
          <${dropDownOptionHeaderSelectedCount}/>
          <${dropDownOptionHeaderSelectAll}>
            <${dropDownOptionHeaderSelectAllCheckbox}/>
            <${dropDownOptionHeaderSelectedTitle}/>
          </dropDownOptionHeaderSelectAll>
        </dropDownOptionHeader>
        <${dropDownSearchOptionContainer}>
          <${dropDownSearchOption}/>
        </dropDownSearchOptionContainer>
        <${dropDownSelectOptionsContainer}>
          <${dropDownOptions}/>
        </dropDownSelectOptionsContainer>
      </dropDownOptionsContainer>
  </dropDownContainer>
  `;
}
