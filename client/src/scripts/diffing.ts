interface NodeDifference {
  action: 'modify' | 'replace';
  target: 'classList' | 'id' | 'node' | 'nodeValue';
}

function compareDomNode (oldNode: Node, newNode: Node) {
  const results: NodeDifference[] = [];
  if (oldNode instanceof HTMLElement && newNode instanceof HTMLElement) {
    if (oldNode.tagName !== newNode.tagName) {
      results.push({
        action: 'replace',
        target: 'node',
      });

      return results;
    }

    if (oldNode.classList.length !== newNode.classList.length) {
      results.push({
        action: 'modify',
        target: 'classList',
      });
    } else if (oldNode.classList.length === newNode.classList.length) {
      for (let index = 0; index < oldNode.classList.length; index++) {
        const aClass = oldNode.classList[index];
        const bClass = newNode.classList[index];

        if (aClass !== bClass) {
          results.push({
            action: 'modify',
            target: 'classList',
          });
          break;
        }
      }
    }

    if (oldNode.id !== newNode.id) {
      results.push({
        action: 'modify',
        target: 'id',
      });
    }

    if (oldNode.nodeValue !== newNode.nodeValue) {
      results.push({
        action: 'modify',
        target: 'nodeValue',
      });
    }
  } else if (oldNode instanceof Text && newNode instanceof Text) {
    results.push({
      action: 'modify',
      target: 'nodeValue',
    });
  } else if (oldNode instanceof Text || newNode instanceof Text) {
    results.push({
      action: 'replace',
      target: 'node',
    });
  }

  return results;
}

interface DiffingNode {
  childNodes: ChildNode[];
  parent: HTMLElement;
}

interface NodesToExplore {
  newTreeNode: DiffingNode;
  oldTreeNode: DiffingNode;
}

/*
 Sourced from: https://stackoverflow.com/a/52473108
 When iterating over the properties of an object in TypeScript, some of them can
 be readonly. When I'm iterating over all of them and then filtering them, TypeScript
 doesn't know if the ones I'm filtering are going to be readonly or not if even one of the
 properties could be. So, I need a type to assert that all the properties I'm accessing
 are writable.
 */

type IfEquals<X, Y, A, B> =
    [0, 1, X] & [2] extends [0, 1, Y] & [0, infer W, unknown] & [2]
      ? W extends 1 ? B : A
      : B;
type WritableKeysOf<T> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>
}[keyof T];

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
      const compareResults = compareDomNode(newTreeChild, oldTreeChild);

      for (const compareResult of compareResults) {
        switch (compareResult.action) {
          case 'modify': {
            if (compareResult.target === 'classList') {
              oldTreeChild.classList.remove(...oldTreeChild.classList.values());
              oldTreeChild.classList.add(...newTreeChild.classList.values());
            } else if (compareResult.target === 'id') {
              oldTreeChild.id = newTreeChild.id;
            } else if (compareResult.target === 'nodeValue') {
              oldTreeChild.nodeValue = newTreeChild.nodeValue;
            }

            // eslint-disable-next-line guard-for-in
            for (const property in newTreeChild) {
              if (property.startsWith('on')) {
                const propertyAsKey = property as keyof WritableKeysOf<HTMLElement>;
                if (newTreeChild[propertyAsKey]) {
                  oldTreeChild[propertyAsKey] = newTreeChild[propertyAsKey];
                }
              }
            }

            nodesToExplore.push({
              newTreeNode: {
                childNodes: [...newTreeChild.childNodes],
                parent: newTreeChild,
              }, oldTreeNode: {
                childNodes: [...oldTreeChild.childNodes],
                parent: oldTreeChild,
              },
            });

            break;
          }
          case 'replace': {
            oldTreeChildren.parent.replaceChild(oldTreeChild, newTreeChild);
            break;
          }
          default: {
            break;
          }
        }
      }

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
