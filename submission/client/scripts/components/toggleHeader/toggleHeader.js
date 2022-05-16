import htmlx from 'Scripts/htmlX';
import {createElement} from 'Scripts/uiUtils';
import commonComponentsStyles from 'Styles/commonComponents.module.scss';

export default function createToggleHeader(props) {
  const headerContainer = createElement('div', {
    onclick: () => {
      props.setToggled((previous) => !previous);
    },
  }, commonComponentsStyles.toggleHeader);
  const headerTitle = createElement('p', {textContent: props.title}, commonComponentsStyles.toggleHeaderTitle);
  const headerArrow = createElement('i', undefined, commonComponentsStyles.biCaretDownFill);
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
