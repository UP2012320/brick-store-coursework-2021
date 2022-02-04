interface NodeDifference {
  action: 'modify' | 'replace';
  target: 'classList' | 'node';
}

function compareDomNode (oldNode: Node, newNode: Node): NodeDifference | undefined {
  if (oldNode instanceof HTMLElement && newNode instanceof HTMLElement) {
    if (oldNode.tagName !== newNode.tagName) {
      return {
        action: 'replace',
        target: 'node',
      };
    }

    if (oldNode.classList.length !== newNode.classList.length) {
      return {
        action: 'modify',
        target: 'classList',
      };
    } else if (oldNode.classList.length === newNode.classList.length) {
      for (let index = 0; index < oldNode.classList.length; index++) {
        const aClass = oldNode.classList[index];
        const bClass = newNode.classList[index];

        if (aClass !== bClass) {
          return {
            action: 'modify',
            target: 'classList',
          };
        }
      }
    }
  } else if (oldNode instanceof Text || newNode instanceof Text) {
    return {
      action: 'replace',
      target: 'node',
    };
  }

  return undefined;
}

interface DiffingNode {
  childNodes: ChildNode[];
  parent: HTMLElement;
}

interface NodesToExplore {
  newTreeNode: DiffingNode;
  oldTreeNode: DiffingNode;
}

function processCompareResult (difference: NodeDifference,
  newTreeChild: HTMLElement,
  oldTreeChild: HTMLElement,
  oldTreeChildren: DiffingNode) {
  switch (difference.action) {
    case 'modify': {
      if (difference.target === 'classList') {
        oldTreeChild.classList.remove(...oldTreeChild.classList.values());
        oldTreeChild.classList.add(...newTreeChild.classList.values());
      }

      // This is a hack I'm not proud of
      for (const key in newTreeChild) {
        if (Object.getOwnPropertyDescriptor(newTreeChild, key)?.writable) {
          if (newTreeChild[key as never]) {
            oldTreeChild[key as never] = newTreeChild[key as never];
          } else {
            oldTreeChild[key as never] = undefined as never;
          }
        }
      }

      break;
    }
    case 'replace': {
      oldTreeChildren.parent.replaceChild(newTreeChild, oldTreeChild);
      break;
    }
    default: {
      break;
    }
  }
}

function mergeDomElementChildren (newTreeChildren: DiffingNode, oldTreeChildren: DiffingNode) {
  const nodesToExplore: NodesToExplore[] = [];

  const highestIndex = newTreeChildren.childNodes.length >= oldTreeChildren.childNodes.length ?
    newTreeChildren.childNodes.length :
    oldTreeChildren.childNodes.length;

  for (let index = 0; index < highestIndex; index++) {
    const newTreeChild = newTreeChildren.childNodes[index] as HTMLElement | undefined;
    const oldTreeChild = oldTreeChildren.childNodes[index] as HTMLElement | undefined;

    if (!newTreeChild && oldTreeChild) {
      oldTreeChild.remove();
    } else if (newTreeChild && !oldTreeChild) {
      oldTreeChildren.parent.append(newTreeChild);
    } else if (newTreeChild && oldTreeChild) {
      const compareResult = compareDomNode(newTreeChild, oldTreeChild);

      if (compareResult) {
        processCompareResult(compareResult, newTreeChild, oldTreeChild, oldTreeChildren);
      }

      if (!compareResult || compareResult.action === 'modify') {
        nodesToExplore.push({
          newTreeNode: {
            childNodes: [...newTreeChild.childNodes],
            parent: newTreeChild,
          }, oldTreeNode: {
            childNodes: [...oldTreeChild.childNodes],
            parent: oldTreeChild,
          },
        });
      }
    }
  }

  for (const nodeToExplore of nodesToExplore) {
    mergeDomElementChildren(nodeToExplore.newTreeNode, nodeToExplore.oldTreeNode);
  }
}

export function mergeDomTrees (newTree: HTMLElement, oldTree: HTMLElement) {
  const newTreeChildren = [...newTree.childNodes];
  const oldTreeChildren = [...oldTree.childNodes];

  mergeDomElementChildren({
    childNodes: newTreeChildren,
    parent: newTree,
  }, {
    childNodes: oldTreeChildren,
    parent: oldTree,
  });
}
