import createSidebar from 'Scripts/components/sidebar/sidebar';
import {nameof} from 'Scripts/helpers';
import {useState} from 'Scripts/hooks/useState';
import htmlx from 'Scripts/htmlX';
import {createElement, createKeyedContainer} from 'Scripts/uiUtils';
import filterBarStyles from 'Styles/components/filterBar.module.scss';
import {type HasBodyProps} from 'Types/types';

const key = nameof(createAllFilters);

export default function createAllFilters (props: HasBodyProps) {
  const [toggled, setToggled] = useState(key, false);

  const allFiltersRowItem = createKeyedContainer('div', key, undefined, filterBarStyles.filterBarOptionsRowItem);
  const allFiltersContainer = createElement('div', {
    onclick: () => setToggled((previous) => !previous),
  }, filterBarStyles.filterBarFilterAllContainer);
  const sliders = createElement('i', undefined, filterBarStyles.biSliders);
  const title = createElement('p', {
    textContent: 'All Filters',
  }, filterBarStyles.filterBarFilterAllTitle);

  const sidebar = createSidebar({
    body: props.body,
    key: 'sidebar-filter-all',
    setToggled,
    toggled,
  });

  return htmlx`
  <${allFiltersRowItem}>
    <${allFiltersContainer}>
      <${sliders}/>
      <${title}/>
    </allFiltersContainer>
    <${sidebar}/>
  </allFiltersRowItem>
  `;
}
