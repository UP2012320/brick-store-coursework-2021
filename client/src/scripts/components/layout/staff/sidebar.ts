import {nameof} from 'Scripts/helpers';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import sidebarStyles from './sidebar.module.scss';

const key = nameof(createSidebar);

export interface SidebarProps {
  options: Array<{
    href: string,
    title: string,
  }>;
  title: string;
}

export default function createSidebar (props: SidebarProps) {
  const [collapsed, setCollapsed] = useState(key, false);

  const container = createElementWithStyles('div', undefined, sidebarStyles.sidebarContainer);

  const titleContainer = createElementWithStyles('div', undefined, sidebarStyles.sidebarTitleContainer);
  const title = createElementWithStyles('h1', {
    textContent: props.title,
  }, sidebarStyles.sidebarTitle);

  const onCollapse = () => {
    setCollapsed((previous) => !previous);
  };

  const collapseButton = createElementWithStyles('i', {
    onclick: () => onCollapse(),
  }, sidebarStyles.biCaretLeftFill);

  if (collapsed) {
    container.classList.add(sidebarStyles.collapsed);
    collapseButton.classList.add(sidebarStyles.toggled);
  } else {
    container.classList.remove(sidebarStyles.collapsed);
    collapseButton.classList.remove(sidebarStyles.toggled);
  }

  const rowsContainer = createElementWithStyles('div', undefined, sidebarStyles.rowsContainer);

  const rows = [];

  for (const option of props.options) {
    const row = createElementWithStyles('a', {
      href: option.href,
      textContent: option.title,
    }, sidebarStyles.actionButton);
    registerLinkClickHandler(row);

    rows.push(row);
  }

  return htmlx`
    <${container}>
     <${titleContainer}>
        <${title}/>
        <${collapseButton}/>
     </${titleContainer}>
     <${rowsContainer}>
        <${rows}/>
     </${rowsContainer}>
    </container>
  `;
}
