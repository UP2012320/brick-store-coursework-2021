import {Mapping, MergedMapping} from 'Types/types';

export function render(initElements: Mapping, appParent: HTMLElement | null) {
  if (!appParent) {
    throw new Error('App parent was null or undefined');
  }

  traverse(initElements);
}

function traverse(mapping: Mapping) {
  mapping.forEach(map => {
    traverseNode(map);
  });
}

function traverseNode(mapping: MergedMapping) {
  const a = 1;
}
