import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement} from 'Scripts/uiUtils';
import commonComponentsStyles from 'Styles/commonComponents.module.scss';
import dropDownStyles from '../dropdown.module.scss';

export default function createDropdownMultiSelectBody(props) {
  props.key ??= nameof(createDropdownMultiSelectBody);
  const [allToggled, setAllToggled] = useState(props.key, false);
  const [options, setOptions] = useState(props.key, [...props.dropDownOptions]);
  const [visibleOptions, setVisibleOptions] = useState(props.key, props.dropDownOptions.map((option) => option.value));
  const [inputValue, setInputValue] = useState(props.key, '');
  useEffect(props.key, () => {
    props.onOptionsChange(options);
    setAllToggled(options.some((option) => option.toggled));
  }, [options]);
  useEffect(props.key, () => {
    setVisibleOptions(options.filter((option) => option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      !inputValue).map((option) => option.value));
  }, [inputValue]);
  useEffect(props.key, () => {
    setOptions([...props.dropDownOptions]);
    setVisibleOptions(props.dropDownOptions.map((option) => option.value));
  }, [props.dropDownOptions]);
  const toggleOptions = (targetValues) => {
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
        const filteredNewOptions = newOptions.filter((option) => visibleOptions.includes(option.value));
        for (const option of filteredNewOptions) {
          const index = newOptions.findIndex((newOptionArrow) => newOptionArrow.value === option.value);
          const newOption = {...newOptions[index]};
          newOption.toggled = !allToggled;
          newOptions[index] = newOption;
        }
      }
      return newOptions;
    });
  };
  const dropDownOptionHeader = createElement('div', undefined, dropDownStyles.dropdownOptionHeader);
  const dropDownOptionHeaderSelectedCount = createElement('p', {
    textContent: `${options.filter((option) => option.toggled).length} Selected`,
  }, dropDownStyles.dropdownOptionHeaderSelected);
  const dropDownOptionHeaderSelectAll = createElement('div', {
    onclick: () => {
      toggleOptions();
      setAllToggled((previous) => !previous);
    },
  }, dropDownStyles.dropdownOptionHeaderSelectAll);
  if (visibleOptions.length !== options.length) {
    dropDownOptionHeaderSelectAll.classList.toggle(commonComponentsStyles.hidden);
  }
  const dropDownOptionHeaderSelectedTitle = createElement('p', {
    textContent: allToggled ? 'Clear' : 'All',
  }, dropDownStyles.dropdownOptionHeaderSelectAllTitle);
  const dropDownOptionHeaderSelectAllCheckbox = createElement('i', undefined, dropDownStyles.biCheck);
  const dropDownSearchOptionContainer = createElement('div', undefined, dropDownStyles.dropdownSearchOptionContainer);
  const dropDownSearchOption = createElement('input', {
    oninput: (event) => {
      if (event?.target) {
        const value = event.target.value;
        setInputValue(value);
      }
    },
    placeholder: 'Search',
    value: inputValue,
  }, dropDownStyles.dropdownOptionText);
  const dropDownSelectOptionsContainer = createElement('ul', {
    ariaRoleDescription: 'list',
  }, dropDownStyles.dropdownSelectOptionsContainer);
  const dropDownOptions = [];
  const filteredOptions = options.filter((option) => visibleOptions.includes(option.value));
  for (const option of filteredOptions) {
    const dropDownOptionContainer = createElement('li', {
      onclick: () => toggleOptions([option.value]),
    }, dropDownStyles.dropdownOptionContainer);
    const dropDownCheck = createElement('i', undefined, dropDownStyles.biCheck);
    const dropDownCheckBox = createElement('div', undefined, dropDownStyles.dropdownOptionCheckbox);
    if (option.toggled) {
      dropDownCheck.classList.remove(commonComponentsStyles.hidden);
    } else {
      dropDownCheck.classList.add(commonComponentsStyles.hidden);
    }
    const dropDownOption = createElement('div', {textContent: option.name}, dropDownStyles.dropdownOptionText);
    dropDownOptions.push(htmlx`
    <${dropDownOptionContainer}>
       <${dropDownCheckBox}>
         <${dropDownCheck}/>
       </dropDownTick>
       <${dropDownOption}/>
     </dropDownOptionContainer>
    `);
  }
  return [
    htmlx`
     <${dropDownOptionHeader}>
     <${dropDownOptionHeaderSelectedCount}/>
     <${dropDownOptionHeaderSelectAll}>
       <${dropDownOptionHeaderSelectAllCheckbox}/>
       <${dropDownOptionHeaderSelectedTitle}/>
     </dropDownOptionHeaderSelectAll>
   </dropDownOptionHeader>
   `,
    htmlx`
      <${dropDownSearchOptionContainer}>
        <${dropDownSearchOption}/>
      </dropDownSearchOptionContainer>
      `,
    htmlx`
      <${dropDownSelectOptionsContainer}>
        <${dropDownOptions}/>
      </dropDownSelectOptionsContainer>
      `,
  ];
}
