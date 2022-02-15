import {nameof} from 'Scripts/helpers';
import {useAfterRender} from 'Scripts/hooks/useAfterRender';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import dropDownStyles from 'Styles/components/dropdown.module.scss';

export interface createDropDownProps<T> {
  onselect: (valueSelected: [string, T]) => void;
  options: Record<string, T>;
}

export default function createDropDown<T> (props: createDropDownProps<T>) {
  const [dropDownToggle, setDropDownToggle] = useState(nameof(createDropDown), false);

  const dropDownContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownContainer);

  const dropDownWidthContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownWidthContainer);

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

  const dropDownOption = createElementWithStyles('div', {textContent: '1234567'}, dropDownStyles.dropdownOption);
  const dropDownOption2 = createElementWithStyles('div', {textContent: '12345678'}, dropDownStyles.dropdownOption);
  const dropDownOption3 = createElementWithStyles('div', {textContent: '123456789'}, dropDownStyles.dropdownOption);

  const dropDownOptionContainer = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionContainer);
  const dropDownOptionContainer2 = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionContainer);
  const dropDownOptionContainer3 = createElementWithStyles('div', undefined, dropDownStyles.dropdownOptionContainer);

  useAfterRender(nameof(createDropDown), () => {
    const targetWidth = Number.parseFloat(getComputedStyle(dropDownOptionsContainer).width);
    dropDownWidthContainer.style.width = (targetWidth - 1).toFixed(2) + 'px';
  });

  return htmlx`
  <${dropDownContainer}>
    <${dropDownWidthContainer}>
      <${dropDownSelectedRow}>
        <${dropDownSelectedOption}/>
        <${dropDownToggleArrow}/>
      </dropDownSelectedRow>
      <${dropDownOptionsContainer}>
        <${dropDownOptionContainer}>
          <${dropDownOption}/>
        </dropDownOptionContainer>
        <${dropDownOptionContainer2}>
          <${dropDownOption2}/>
        </dropDownOptionContainer>
        <${dropDownOptionContainer3}>
          <${dropDownOption3}/>
        </dropDownOptionContainer>
      </dropDownOptionsContainer>
    </dropDownWidthContainer>
  </dropDownContainer>
  `;
}
