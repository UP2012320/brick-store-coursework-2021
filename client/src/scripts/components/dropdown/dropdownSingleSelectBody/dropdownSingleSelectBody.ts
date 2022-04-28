import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import {type DropDownOption, type ReUsableComponentProps} from 'Types/types';
import dropDownStyles from '../dropdown.module.scss';

export interface DropdownSingleSelectBodyProps extends ReUsableComponentProps {
  dropDownOptions: DropDownOption[];
  onSelectedChange: (selected: DropDownOption) => void;
}

export default function createDropdownSingleSelectBody (props: DropdownSingleSelectBodyProps) {
  props.key ??= nameof(createDropdownSingleSelectBody);

  const [selected, setSelected] = useState(props.key, props.dropDownOptions[0]);

  useEffect(props.key, () => {
    props.onSelectedChange(selected);
  }, [selected]);

  const dropDownSelectOptionsContainer = createElementWithStyles('ul', {
    ariaRoleDescription: 'list',
  }, dropDownStyles.dropdownSelectOptionsContainer);

  const dropDownOptions = [];

  for (const option of props.dropDownOptions) {
    const dropDownOptionContainer = createElementWithStyles('li', {
      onclick: () => setSelected(option),
    }, dropDownStyles.dropdownOptionContainer);
    const dropDownCheck = createElementWithStyles('i', undefined, option.value === selected.value ? dropDownStyles.biCircleFill : dropDownStyles.biCircle);

    const dropDownOption = createElementWithStyles('div', {textContent: option.name}, dropDownStyles.dropdownOptionText);

    dropDownOptions.push(htmlx`
    <${dropDownOptionContainer}>
       <${dropDownCheck}/>
       <${dropDownOption}/>
     </dropDownOptionContainer>
    `);
  }

  return htmlx`
      <${dropDownSelectOptionsContainer}>
        <${dropDownOptions}/>
      </dropDownSelectOptionsContainer>
      `;
}
