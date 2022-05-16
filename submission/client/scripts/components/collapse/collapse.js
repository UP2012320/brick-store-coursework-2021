import createToggleHeader from 'Scripts/components/toggleHeader/toggleHeader';
import {nameof} from 'Scripts/helpers';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import collapseStyles from './collapse.module.scss';

export default function createCollapse(props) {
  props.key ??= nameof(createCollapse);
  const [toggled, setToggled] = useState(props.key, false);
  const collapseContainer = createKeyedContainer('div', props.key, undefined, collapseStyles.collapseContainer);
  const collapseToggleHeader = createToggleHeader({
    key: `${props.key}-toggle-header`,
    setToggled,
    title: props.title,
    toggled,
  });
  const collapseContentContainer = createElement('div', undefined, collapseStyles.collapseContentContainer);
  if (toggled) {
    collapseContentContainer.classList.add(collapseStyles.collapseOpen);
  } else {
    collapseContentContainer.classList.remove(collapseStyles.collapseOpen);
  }
  return htmlx`
  <${collapseContainer}>
    <${collapseToggleHeader}/>
    <${collapseContentContainer}>
      <${props.body}/>
    </collapseBodyContainer>
  </collapseContainer>
  `;
}
