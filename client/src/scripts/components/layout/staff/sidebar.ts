import htmlx from 'Scripts/htmlX';
import {createElementWithStyles, registerLinkClickHandler} from 'Scripts/uiUtils';
import sidebarStyles from './sidebar.module.scss';

export interface SidebarProps {
  options: Array<{
    href: string,
    title: string,
  }>;
  title: string;
}

export default function createSidebar (props: SidebarProps) {
  const container = createElementWithStyles('div', undefined, sidebarStyles.sidebarContainer);

  const titleContainer = createElementWithStyles('div', undefined, sidebarStyles.sidebarTitleContainer);
  const title = createElementWithStyles('h1', {
    textContent: props.title,
  }, sidebarStyles.sidebarTitle);

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
     </${titleContainer}>
     <${rowsContainer}>
        <${rows}/>
     </${rowsContainer}>
    </container>
  `;
}
