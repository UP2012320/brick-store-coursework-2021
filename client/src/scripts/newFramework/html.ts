import {ParsedElement} from 'Scripts/newFramework/parsedElement';
import {HtmlAttribute, HtmlTags} from 'Types/types';

function matchAttributesFromHtmlTagOpening(tag: string) {
  const attributeRegex = /\s+(?<key>.+?)=['"`](?<value>.+?)['"`]/gmi;

  const attributes: HtmlAttribute[] = [];
  let m;

  while ((m = attributeRegex.exec(tag)) !== null) {
    if (m.index === attributeRegex.lastIndex) {
      attributeRegex.lastIndex++;
    }

    if (m.groups) {
      attributes.push({
        key: m.groups['key'],
        value: m.groups['value'],
        valueIsArg: m.groups['value']?.match(/^###\d+###$/gmi) !== null,
      });
    }
  }

  return attributes;
}

function parseHtmlTag(tag: string): HtmlTags {
  let match;

  if ((match = /^<(?<tag>\w+)(?:(?=>)|.*[^\/])>$/gmi.exec(tag))) {
    return {
      type: 'opening',
      attributes: matchAttributesFromHtmlTagOpening(tag),
      tag: match?.groups?.tag ?? 'unknown'
    };
  } else if ((match = /^<\/(?<tag>\w+)>$/gmi.exec(tag))) {
    return {
      type: 'closing',
      tag: match.groups?.tag ?? 'unknown'
    };
  } else if ((match = /^<(?<tag>\w+).*\/>$/gmi.exec(tag))) {
    return {
      type: 'selfClosing',
      attributes: matchAttributesFromHtmlTagOpening(tag),
      tag: match.groups?.tag ?? 'unknown'
    };
  } else if (tag.match(/^###\d+###$/gmi)) {
    return {
      type: 'text',
      value: tag,
      valueIsArg: true,
      tag: '#text'
    };
  } else {
    return {
      type: 'text',
      value: tag,
      tag: '#text'
    };
  }
}

Array.prototype.skip = function(amount) {
  if (amount >= this.length) {
    return [];
  }

  const newArray = [];

  for (let i = amount; i < this.length; i++) {
    newArray.push(this[i]);
  }

  return newArray;
};

Array.prototype.skipLast = function(amount) {
  if ((this.length - amount) <= 0) {
    return [];
  }

  const newArray = [];

  for (let i = 0; i < this.length - amount; i++) {
    newArray.push(this[i]);
  }

  return newArray;
};

export default function html(templates: TemplateStringsArray, ...args: unknown[]) {
  let combinedHtml = '';

  console.debug(templates, args);

  templates.forEach((template, index) => {
    if (index >= args.length) {
      combinedHtml += template;
    } else {
      combinedHtml += template + `###${index}###`;
    }
  });

  console.debug(combinedHtml);

  const htmlTags = combinedHtml
    .split(/(<[^>]+>)/gmi)
    .filter(x => x.trim())
    .map(tag => parseHtmlTag(tag));


  htmlTags.forEach(tag => {
    if (tag.type === 'opening' || tag.type === 'selfClosing') {
      tag.attributes.forEach(attribute => {
        if (attribute.valueIsArg) {
          attribute.value = args.shift();
        }
      });
    } else if (tag.type === 'text' && tag.valueIsArg) {
      tag.value = args.shift() as string;
    }
  });

  console.debug(htmlTags);

  const openTags: HtmlTags[] = [];

  let root: ParsedElement;

  if (htmlTags[0].type === 'opening' || htmlTags[0].type === 'selfClosing') {
    root = new ParsedElement(htmlTags[0].tag, htmlTags[0].attributes);
  } else {
    throw new Error('Invalid HTML passed');
  }

  let currentParent = root;

  htmlTags.skip(1).skipLast(1).forEach(tag => {
    switch (tag.type) {
      case 'opening':
        currentParent = currentParent.appendChild(tag.tag, tag.attributes);
        openTags.push(tag);
        break;
      case 'selfClosing':
        currentParent.appendChild(tag.tag, tag.attributes);
        break;
      case 'closing':
        const openTag = openTags.pop();
        console.debug(openTag);

        if (currentParent.parent) {
          currentParent = currentParent.parent;
        }
        break;
      case 'text':
        currentParent.appendChild(tag.tag, undefined, tag.value);
        break;
    }
  });

  console.debug(root);

  return root;
}
