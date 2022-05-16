import {nameof} from 'Scripts/helpers';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import {type ReUsableComponentProps} from 'Types/types';
import tabNavbarStyles from './tabNavbar.module.scss';

export interface TabNavbarProps extends ReUsableComponentProps{
  tabs: Array<{
    onselect: () => void,
    title: string,
  }>;
}

export default function createTabNavbar (props: TabNavbarProps) {
  props.key ??= nameof(createTabNavbar);

  const container = createKeyedContainer('div', props.key, undefined, tabNavbarStyles.container);

  return htmlx`
    <${container}>
      <${props.tabs.map((tab) => createElement('button', {
    onclick: tab.onselect,
    textContent: tab.title,
  }, tabNavbarStyles.actionButton))}/>
    </${container}>
  `;
}
