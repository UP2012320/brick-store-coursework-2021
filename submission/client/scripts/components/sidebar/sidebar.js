import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import useOverlay from 'Scripts/hooks/useOverlay';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import sidebarStyles from './sidebar.module.scss';

export default function createSidebar(props) {
  props.key ??= nameof(createSidebar);
  const [overlay, , setToggled] = useOverlay(props.key, props.toggled, props.setToggled);
  const container = createKeyedContainer('section', props.key, undefined, sidebarStyles.sidebarContainer);
  const containerInner = createElement('div', undefined, sidebarStyles.sidebarContainerInner);
  if (props.toggled) {
    container.classList.add(sidebarStyles.sidebarOpen);
  } else {
    container.classList.remove(sidebarStyles.sidebarOpen);
  }
  useEffect(props.key, () => {
    setToggled(props.toggled);
  }, [props.toggled]);
  return [htmlx`
    <${container}>
      <${containerInner}>
        <${props.body}/>
      </containerInner>
    </container>
   `, overlay];
}
