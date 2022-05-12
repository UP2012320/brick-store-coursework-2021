import {nameof} from 'Scripts/helpers';
import {useEffect} from 'Scripts/hooks/useEffect';
import useOverlay from 'Scripts/hooks/useOverlay';
import {type StateSetter} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, createKeyedContainer} from 'Scripts/uiUtils';
import {type HasBodyProps, type ReUsableComponentProps} from 'Types/types';
import sidebarStyles from './sidebar.module.scss';

interface CreateSidebarProps extends ReUsableComponentProps, HasBodyProps {
  setToggled: StateSetter<boolean>;
  toggled: boolean;
}

export default function createSidebar (props: CreateSidebarProps) {
  props.key ??= nameof(createSidebar);

  const [overlay, , setToggled] = useOverlay(props.key, props.toggled, props.setToggled);

  const container = createKeyedContainer('section', props.key, undefined, sidebarStyles.sidebarContainer);

  const containerInner = createElementWithStyles('div', undefined, sidebarStyles.sidebarContainerInner);

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

