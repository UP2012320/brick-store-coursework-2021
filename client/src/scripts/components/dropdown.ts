import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useRef} from 'Scripts/hooks/useRef';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import dropDownStyles from 'Styles/components/dropdown.module.scss';
import type {ReUsableComponentProps} from 'Types/types';

export interface createDropDownProps<T> extends ReUsableComponentProps {
  onselect: (valueSelected: [string, T]) => void;
  options: Record<string, T>;
}

export default function createDropDown<T> (props: createDropDownProps<T>) {
  props.key ??= nameof(createDropDown);

  const [dropDownToggle, setDropDownToggle] = useState(props.key, false);
  const [options, setOptions] = useState(props.key, []);
  const maxDropDownWidth = useRef<string | undefined>(props.key, undefined);

  const dropDownContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownContainer);
  dropDownContainer.setAttribute('key', props.key);

  const dropDownWidthContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownWidthContainer);

  if (maxDropDownWidth.current) {
    dropDownWidthContainer.style.width = maxDropDownWidth.current;
  }

  const dropDownSelectedRow = createElementWithStyles('div', {
    onclick: () => {
      setDropDownToggle((previous) => !previous);
    },
  }, dropDownStyles.dropdownSelectedRow);

  const dropDownSelectedOption = createElementWithStyles('p',
    {textContent: 'test'},
    dropDownStyles.dropdownSelectedOption);

  const dropDownToggleArrow = createElementWithStyles('div', undefined, dropDownStyles.biCaretDownFill);

  const dropDownOptionsContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionsContainer);

  if (dropDownToggle) {
    dropDownOptionsContainer.classList.add(dropDownStyles.dropdownOpen);
    dropDownToggleArrow.classList.add(dropDownStyles.dropdownOpen);
  } else {
    dropDownOptionsContainer.classList.remove(dropDownStyles.dropdownOpen);
    dropDownToggleArrow.classList.remove(dropDownStyles.dropdownOpen);
  }

  const dropDownSearchOptionContainer = createElementWithStyles('div',
    undefined,
    dropDownStyles.dropdownSearchOptionContainer);

  const dropDownSearchOption = createElementWithStyles('input',
    {placeholder: 'Search'},
    dropDownStyles.dropdownOptionText);

  const dropDownCheck = createElementWithStyles('i', undefined, dropDownStyles.biCheck);
  const dropDownCheck2 = createElementWithStyles('i', undefined, dropDownStyles.biCheck);
  const dropDownCheck3 = createElementWithStyles('i', undefined, dropDownStyles.biCheck);

  const dropDownTick = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionCheckbox);
  const dropDownTick2 = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionCheckbox);
  const dropDownTick3 = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionCheckbox);

  const dropDownOptionContainer = createElementWithStyles('div', {
    onclick: (event) => {
      const target = event.currentTarget as HTMLElement;
      const tick = target.querySelector('i');

      if (tick) {
        tick.classList.toggle(dropDownStyles.ticked);
      }
    },
  }, dropDownStyles.dropdownOptionContainer);
  const dropDownOptionContainer2 = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionContainer);
  const dropDownOptionContainer3 = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionContainer);

  const dropDownOption = createElementWithStyles('div', {textContent: '1234567'}, dropDownStyles.dropdownOptionText);
  const dropDownOption2 = createElementWithStyles('div', {textContent: '12345678'}, dropDownStyles.dropdownOptionText);
  const dropDownOption3 = createElementWithStyles('div', {textContent: '123456789'}, dropDownStyles.dropdownOptionText);

  useEffect(props.key, () => {
    const targetWidth = Number.parseFloat(getComputedStyle(dropDownOptionsContainer).width);
    const widthValue = (targetWidth - 2).toFixed(2) + 'px';

    maxDropDownWidth.current = widthValue;
    dropDownWidthContainer.style.width = widthValue;
  }, []);

  return htmlx`
  <${dropDownContainer}>
    <${dropDownWidthContainer}>
      <${dropDownSelectedRow}>
        <${dropDownSelectedOption}/>
        <${dropDownToggleArrow}/>
      </dropDownSelectedRow>
      <${dropDownOptionsContainer}>
        <${dropDownSearchOptionContainer}>
          <${dropDownSearchOption}/>
        </dropDownSearchOptionContainer>
        <${dropDownOptionContainer}>
          <${dropDownTick}>
            <${dropDownCheck}/>
          </dropDownTick>
          <${dropDownOption}/>
        </dropDownOptionContainer>
        <${dropDownOptionContainer2}>
          <${dropDownTick2}>
            <${dropDownCheck2}/>
          </dropDownTick2>
          <${dropDownOption2}/>
        </dropDownOptionContainer>
        <${dropDownOptionContainer3}>
          <${dropDownTick3}>
            <${dropDownCheck3}/>
          </dropDownTick3>
          <${dropDownOption3}/>
        </dropDownOptionContainer>
      </dropDownOptionsContainer>
    </dropDownWidthContainer>
  </dropDownContainer>
  `;
}
