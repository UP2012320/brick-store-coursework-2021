import Root from 'Scripts/framework/root';
import ComponentElement from 'Scripts/framework/componentElement';
import {render} from 'Scripts/newFramework/virtualDom';
import {createElement} from 'Scripts/uiUtils';
import {Component, Mapping} from 'Types/types';

function test2(): Mapping {
  return [
    createElement('p')
  ];
}

function test(): Mapping {
  return [
    createElement('div'),
    createElement('p'),
    test2
  ];
}

render(test(), document.getElementById('root'));

//const root = new Root({}, new ComponentElement(document.body));
//root.build();
