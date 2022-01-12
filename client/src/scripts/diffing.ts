/*
classlist
textcontent
id
tag
 */

interface NodeDifference {
  action: 'add' | 'modify' | 'remove';
  target: 'classList' | 'id' | 'node' | 'nodeValue';
}

function compareDomNode (a?: HTMLElement | Node, b?: HTMLElement | Node) {
  const results: NodeDifference[] = [];

  if (b !== undefined && a === undefined) {
    results.push({
      action: 'remove',
      target: 'node',
    });

    return results;
  }

  if (a !== undefined && b === undefined) {
    results.push({
      action: 'add',
      target: 'node',
    });

    return results;
  }

  if (a && b) {
    if (a instanceof HTMLElement && b instanceof HTMLElement) {
      if (a.tagName !== b.tagName) {
        results.push({
          action: 'remove',
          target: 'node',
        });

        return results;
      }

      if (a.classList.length !== b.classList.length) {
        results.push({
          action: 'modify',
          target: 'classList',
        });
      } else if (a.classList.length === b.classList.length) {
        for (let index = 0; index < a.classList.length; index++) {
          const aClass = a.classList[index];
          const bClass = b.classList[index];

          if (aClass !== bClass) {
            results.push({
              action: 'modify',
              target: 'classList',
            });
            break;
          }
        }
      }

      if (a.id !== b.id) {
        results.push({
          action: 'modify',
          target: 'id',
        });
      }
    }

    if (a.nodeValue !== b.nodeValue) {
      results.push({
        action: 'modify',
        target: 'nodeValue',
      });
    }
  }

  return results;
}

interface Nodes {
  children: Array<HTMLElement | Node>;
  parent?: HTMLElement;
}

interface VirtualDomElement {
  attributes: Array<{name: string, value: string, }>;
  children: VirtualDomElement[];
  nodeValue: string;
  tagName: string;
}

export function domToVirtualDom (dom: HTMLElement | Node) {
  let virtualDomElement: VirtualDomElement;

  if (dom instanceof HTMLElement) {
    virtualDomElement = {
      attributes: [...dom.attributes].map((value) => ({name: value.name, value: value.value})),
      children: [],
      nodeValue: dom.nodeValue ?? '',
      tagName: dom.tagName,
    };
  } else {
    virtualDomElement = {
      attributes: [],
      children: [],
      nodeValue: dom.nodeValue ?? '',
      tagName: dom.nodeName,
    };
  }

  for (const childNode of dom.childNodes) {
    virtualDomElement.children.push(domToVirtualDom(childNode));
  }

  return virtualDomElement;
}

export function virtualDomToDom (documentNode: Document, virtualDom: VirtualDomElement) {
  let domElement: HTMLElement | Text;

  if (virtualDom.tagName === '#text') {
    domElement = documentNode.createTextNode(virtualDom.nodeValue);
  } else {
    domElement = documentNode.createElement(virtualDom.tagName);
    domElement.nodeValue = virtualDom.nodeValue;

    for (const {name, value} of virtualDom.attributes) {
      domElement.setAttribute(name, value);
    }

    for (const child of virtualDom.children) {
      domElement.append(virtualDomToDom(documentNode, child));
    }
  }

  return domElement;
}

// eslint-disable-next-line complexity
export function mergeDomTrees (newTree: HTMLElement, oldTree: HTMLElement) {
  const aNodes: Nodes[] = [{children: [...newTree.childNodes], parent: newTree}];
  const bNodes: Nodes[] = [{children: [...oldTree.childNodes], parent: oldTree}];

  while (aNodes.length > 0 || bNodes.length > 0) {
    const aNode = [aNodes.shift()] ?? [{children: [], parent: undefined}];
    const bNode = [bNodes.shift()] ?? [{children: [], parent: undefined}];

    /* while (aNode.length > 0 || bNode.length > 0) {
      const aNodeChild = aNode.pop();
      const bNodeChild = bNode.pop();

      if (aNodeChild) {
        aNode.children.push({children: [...aNodeChild.childNodes], parent: aNodeChild as HTMLElement});
      }

      const compareResults = compareDomNode(aNodeChild, bNodeChild);

      for (const result of compareResults) {
        switch (result.action) {
          case 'add':
            if (aNodeChild && bNode.parent) {
              bNode.parent.append(aNodeChild);
            }

            break;
          case 'remove':
            if (bNodeChild) {
              bNode.parent?.removeChild(bNodeChild);
            }

            break;
          case 'modify':
            if (bNodeChild && aNodeChild) {
              bNode.parent?.replaceChild(aNodeChild, bNodeChild);
            }

            break;
          default:
            console.debug('idk');
            break;
        }
      }

      if (compareResults.every((result) => result.action !== 'remove') && bNodeChild) {
        bNodes.push({children: [...bNodeChild.childNodes], parent: bNodeChild as HTMLElement});
      }
    }*/
  }

  /* while (aNodes.length > 0 || bNodes.length > 0) {
    const aNode = aNodes.pop() ?? {children: [], parent: undefined};
    const bNode = bNodes.pop() ?? {children: [], parent: undefined};

    while (aNode.children.length > 0 || bNode.children.length > 0) {
      const aNodeChild = aNode.children.shift();
      const bNodeChild = bNode.children.shift();

      if (aNodeChild) {
        aNode.children.push({children: [...aNodeChild.childNodes], parent: aNodeChild as HTMLElement});
      }

      const compareResults = compareDomNode(aNodeChild, bNodeChild);

      for (const result of compareResults) {
        switch (result.action) {
          case 'add':
            if (aNodeChild && bNode.parent) {
              bNode.parent.append(aNodeChild);
            }

            break;
          case 'remove':
            if (bNodeChild) {
              bNode.parent?.removeChild(bNodeChild);
            }

            break;
          case 'modify':
            if (bNodeChild && aNodeChild) {
              bNode.parent?.replaceChild(aNodeChild, bNodeChild);
            }

            break;
          default:
            console.debug('idk');
            break;
        }
      }

      if (compareResults.every((result) => result.action !== 'remove') && bNodeChild) {
        bNodes.push({children: [...bNodeChild.childNodes], parent: bNodeChild as HTMLElement});
      }
    }*/
}
