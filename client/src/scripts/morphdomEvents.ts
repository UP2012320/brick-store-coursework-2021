// Sourced from https://github.com/patrick-steele-idem/morphdom/issues/29#issuecomment-602285398
// As morphdom doesn't replace events

const eventPropertyNames = [
  // taken from https://github.com/choojs/nanomorph/blob/f282b86336e0a0fc1aee95aaf2a242f94d72040d/lib/events.js
  'onclick',
  'ondblclick',
  'onmousedown',
  'onmouseup',
  'onmouseover',
  'onmousemove',
  'onmouseout',
  'onmouseenter',
  'onmouseleave',
  'ontouchcancel',
  'ontouchend',
  'ontouchmove',
  'ontouchstart',
  'ondragstart',
  'ondrag',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondrop',
  'ondragend',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onunload',
  'onabort',
  'onerror',
  'onresize',
  'onscroll',
  'onselect',
  'onchange',
  'onsubmit',
  'onreset',
  'onfocus',
  'onblur',
  'oninput',
  'oncontextmenu',
  'onfocusin',
  'onfocusout',

  // added
  'onanimationend',
  'onanimationiteration',
  'onanimationstart',
];

// Using never as a hacky workaround because TS will moan
function updateEvents (fromElement: never, toElement: never) {
  for (const eventPropertyName of eventPropertyNames) {
    if (fromElement[eventPropertyName] !== toElement[eventPropertyName]) {
      fromElement[eventPropertyName] = toElement[eventPropertyName];
    }
  }
}

interface Input {
  onBeforeElUpdated?: (fromElement: HTMLElement, toElement: HTMLElement) => unknown;
  onNodeDiscarded?: ((node: Node) => void) | undefined;
}

export default function withEvents (input: Input) {
  return {
    ...input,
    onBeforeElUpdated (fromElement: HTMLElement, toElement: HTMLElement) {
      if (input.onBeforeElUpdated) {
        const shouldContinue = input.onBeforeElUpdated.call(this, fromElement, toElement);
        if (!shouldContinue) {
          return false;
        }
      }

      updateEvents(fromElement as never, toElement as never);
      return true;
    },
  };
}
