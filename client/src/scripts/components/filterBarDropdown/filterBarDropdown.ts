import createDropDown from 'Scripts/components/dropdown';
import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useRef} from 'Scripts/hooks/useRef';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import dropDownStyles from 'Styles/components/dropdown.module.scss';
import filterBarStyles from 'Styles/components/filterBar.module.scss';
import type {ReUsableComponentProps} from 'Types/types';

interface DropDownOption {
  name: string;
  toggled: boolean;
  value: string;
}

export interface filterBarDropdownProps extends ReUsableComponentProps {
  dropDownOptions: DropDownOption[];
  title: string;
}

export default function createFilterBarDropdown (props: filterBarDropdownProps) {
  props.key ??= nameof(createFilterBarDropdown);

  const [toggled, setToggled] = useState(props.key, false);
  const [allToggled, setAllToggled] = useState(props.key, false);
  const [options, setOptions] = useState(props.key, props.dropDownOptions);
  const [visibleOptions, setVisibleOptions] = useState<string[]>(props.key, props.dropDownOptions.map((option) => option.value));
  const [inputValue, setInputValue] = useState(props.key, '');

  useEffect(props.key, () => {
    setAllToggled(options.some((option) => option.toggled));
  }, [options]);

  useEffect(props.key, () => {
    setVisibleOptions(options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()) || !inputValue).map((option) => option.value));
  }, [inputValue]);

  const toggleOptions = (targetValues?: string[]) => {
    setOptions((previous) => {
      const newOptions = [...previous];

      if (targetValues) {
        for (const targetValue of targetValues) {
          const index = newOptions.findIndex((newOptionArrow) => newOptionArrow.value === targetValue);
          const newOption = {...newOptions[index]};
          newOption.toggled = !newOptions[index].toggled;
          newOptions[index] = newOption;
        }
      } else {
        console.debug(visibleOptions);
        const filteredNewOptions = newOptions.filter((option) => visibleOptions.includes(option.value));

        for (const option of filteredNewOptions) {
          option.toggled = !allToggled;
        }
      }

      return newOptions;
    });
  };

  const rowItem = createElementWithStyles('div', undefined, filterBarStyles.filterBarOptionsRowItem);

  const dropDownContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownContainer);
  dropDownContainer.setAttribute('key', props.key);

  const dropDownTitleRow = createElementWithStyles('div', {
    onclick: () => {
      setToggled((previous) => !previous);

      // The state here will be opposite of what the current state is since it's in a callback.
      if (toggled) {
        setTimeout(() => {
          setInputValue('');
        }, 500);
      }
    },
  }, dropDownStyles.dropdownTitleRow);

  const dropDownSelectedOption = createElementWithStyles('p',
    {textContent: props.title},
    dropDownStyles.dropdownTitle);

  const dropDownToggleArrow = createElementWithStyles('div', undefined, dropDownStyles.biCaretDownFill);

  const dropDownOptionsContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionsContainer);

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

  const dropDownOptionHeader = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionHeader);

  const dropDownOptionHeaderSelectedCount = createElementWithStyles('p', {
    textContent: `${options.filter((option) => option.toggled).length} Selected`,
  }, dropDownStyles.dropdownOptionHeaderSelected);

  const dropDownOptionHeaderSelectAll = createElementWithStyles('div', {
    onclick: () => {
      toggleOptions();
      setAllToggled((previous) => !previous);
    },
  }, dropDownStyles.dropdownOptionHeaderSelectAll);

  if (visibleOptions.length !== options.length) {
    dropDownOptionHeaderSelectAll.classList.toggle(dropDownStyles.hidden);
  }

  const dropDownOptionHeaderSelectedTitle = createElementWithStyles('p', {
    textContent: allToggled ? 'Clear' : 'All',
  }, dropDownStyles.dropdownOptionHeaderSelectAllTitle);

  const dropDownOptionHeaderSelectAllCheckbox = createElementWithStyles('i', undefined, dropDownStyles.biCheck);

  const dropDownSearchOptionContainer = createElementWithStyles('div',
    undefined,
    dropDownStyles.dropdownSearchOptionContainer);

  const dropDownSearchOption = createElementWithStyles('input',
    {
      oninput: (event) => {
        if (event?.target) {
          const value = (event.target as HTMLInputElement).value;

          setInputValue(value);
        }
      },
      placeholder: 'Search',
      value: inputValue,
    },
    dropDownStyles.dropdownOptionText);

  const dropDownSelectOptionsContainer = createElementWithStyles('ul', {
    ariaRoleDescription: 'list',
  }, dropDownStyles.dropdownSelectOptionsContainer);

  if (toggled) {
    dropDownTitleRow.classList.add(dropDownStyles.open);
    dropDownOptionsContainer.classList.add(dropDownStyles.dropdownOpen);
    dropDownToggleArrow.classList.add(dropDownStyles.dropdownOpen);
  } else {
    dropDownTitleRow.classList.remove(dropDownStyles.open);
    dropDownOptionsContainer.classList.remove(dropDownStyles.dropdownOpen);
    dropDownToggleArrow.classList.remove(dropDownStyles.dropdownOpen);
  }

  const dropDownOptions = [];
  const filteredOptions = options.filter((option) => visibleOptions.includes(option.value));

  for (const option of filteredOptions) {
    const dropDownOptionContainer = createElementWithStyles('li', {
      onclick: () => toggleOptions([option.value]),
    }, dropDownStyles.dropdownOptionContainer);
    const dropDownCheck = createElementWithStyles('i', undefined, dropDownStyles.biCheck);
    const dropDownCheckBox = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionCheckbox);

    if (option.toggled) {
      dropDownCheck.classList.remove(dropDownStyles.hidden);
    } else {
      dropDownCheck.classList.add(dropDownStyles.hidden);
    }

    const dropDownOption = createElementWithStyles('div', {textContent: option.name}, dropDownStyles.dropdownOptionText);

    dropDownOptions.push(htmlx`
    <${dropDownOptionContainer}>
       <${dropDownCheckBox}>
         <${dropDownCheck}/>
       </dropDownTick>
       <${dropDownOption}/>
     </dropDownOptionContainer>
    `);
  }

  return htmlx`
      <${rowItem}>
          <${dropDownContainer}>
      <${dropDownTitleRow}>
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
      </rowItem>
  `;
}
