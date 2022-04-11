import type {StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles} from 'Scripts/uiUtils';
import commonComponentsStyles from 'Styles/commonComponents.module.scss';
import type {ReUsableComponentProps} from 'Types/types';

export interface CreateToggleHeaderProps extends ReUsableComponentProps {
  setToggled: StateSetter<boolean>;
  title: string;
  toggled: boolean;
}

export default function createToggleHeader (props: CreateToggleHeaderProps) {
  const headerContainer = createElementWithStyles('div', {
    onclick: () => {
      props.setToggled((previous) => !previous);
    },
  }, commonComponentsStyles.toggleHeader);

  const headerTitle = createElementWithStyles('p',
    {textContent: props.title},
    commonComponentsStyles.toggleHeaderTitle);

  const headerArrow = createElementWithStyles('i', undefined, commonComponentsStyles.biCaretDownFill);

  if (props.toggled) {
    headerContainer.classList.add(commonComponentsStyles.open);
    headerArrow.classList.add(commonComponentsStyles.caretOpen);
  } else {
    headerContainer.classList.remove(commonComponentsStyles.open);
    headerArrow.classList.remove(commonComponentsStyles.caretOpen);
  }

  return htmlx`
  <${headerContainer}>
    <${headerTitle}/>
    <${headerArrow}/>
  </headerContainer>
  `;
}
