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
function updateEvents(fromElement, toElement) {
  for (const eventPropertyName of eventPropertyNames) {
    if (fromElement[eventPropertyName] !== toElement[eventPropertyName]) {
      fromElement[eventPropertyName] = toElement[eventPropertyName];
    }
  }
}

export default function withEvents(input) {
  return {
    ...input,
    onBeforeElUpdated(fromElement, toElement) {
      if (input.onBeforeElUpdated) {
        const shouldContinue = input.onBeforeElUpdated.call(this, fromElement, toElement);
        if (!shouldContinue) {
          return false;
        }
      }
      updateEvents(fromElement, toElement);
      return true;
    },
  };
}
