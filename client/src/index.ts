import Root from 'Scripts/framework/root';
import ComponentElement from 'Scripts/framework/componentElement';
import {render} from 'Scripts/newFramework/virtualDom';
import {createElement} from 'Scripts/uiUtils';
import {Component, Mapping} from 'Types/types';
import {template} from '@babel/core';

type HtmlNode = {
  depth?: number
}

type HtmlTag = {
  type: 'closing',
} & HtmlNode;

type HtmlText = {
  type: 'text',
  value: string,
  valueIsArg?: boolean
} & HtmlNode;

type HtmlTagWithAttributes = {
  type: 'opening' | 'selfClosing',
  attributes: HtmlAttribute[]
} & HtmlNode;

type HtmlTags = HtmlTag | HtmlTagWithAttributes | HtmlText;

interface HtmlAttribute {
  key: string,
  value: unknown,
  valueIsArg?: boolean
}

function matchAttributesFromHtmlTagOpening(tag: string) {
  const attributeRegex = /\s+(?<key>.+?)=['"`](?<value>.+?)['"`]/gmi;

  const attributes: HtmlAttribute[] = [];
  let m;

  while ((m = attributeRegex.exec(tag)) !== null) {
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
  if (tag.match(/^<\w+.+[^\/]>$/gmi)) {
    return {
      type: 'opening',
      attributes: matchAttributesFromHtmlTagOpening(tag),
    };
  } else if (tag.match(/^<\/\w+/gmi)) {
    return {
      type: 'closing',
    };
  } else if (tag.match(/^<\w+.+\/>$/gmi)) {
    return {
      type: 'selfClosing',
      attributes: matchAttributesFromHtmlTagOpening(tag)
    };
  } else if (tag.match(/^###\d+###$/gmi)) {
    return {
      type: 'text',
      value: tag,
      valueIsArg: true
    };
  } else {
    return {
      type: 'text',
      value: tag
    };
  }
}

function html(templates: TemplateStringsArray, ...args: unknown[]) {
  let combinedHtml = '';

  templates.forEach((template, index) => {
    if (index >= args.length) {
      combinedHtml += template;
    } else {
      combinedHtml += template + `###${index}###`;
    }
  });

  console.log(combinedHtml);

  const htmlTags = combinedHtml
    .split(/(<[^>]+>)/gmi)
    .filter(x => x.trim())
    .map(tag => parseHtmlTag(tag));


  htmlTags.forEach(tag => {
    if (tag.type === 'opening') {
      tag.attributes.forEach(attribute => {
        if (attribute.valueIsArg) {
          attribute.value = args.shift();
        }
      });
    } else if (tag.type === 'text' && tag.valueIsArg) {
      tag.value = args.shift() as string;
    }
  });

  console.log(htmlTags);

  return;

  /*const cleanedTemplates = templates.map(template => template.replaceAll(/((\s)\s+|\n+|\r+)/gmi, ''));

  const currentlyOpenTags: HtmlTags[] = [];
  let depth = 0;

  cleanedTemplates.forEach((line, index) => {
    const isLastLine = index === cleanedTemplates.length - 1;

    const htmlTags = line
      .split(/(<[^>]+>)/gmi).filter(x => x)
      .map(tag => parseHtmlTag(tag));

    console.log(htmlTags, index);

    for (let i = 0; i < htmlTags.length; i++) {
      const tag = htmlTags[i];
      const isLastTag = i === htmlTags.length - 1;
      const nextTag = isLastTag ? undefined : htmlTags[i + 1];

      switch (tag.type) {
        case 'opening':
          tag.depth = depth++;

          if (tag.attributes.some(tag => tag.valueIsArg)) {
            tag.attributes.forEach(attribute => {
              if (attribute.valueIsArg) {
                attribute.value = args.shift();
              }
            });

            if (isLastTag || nextTag?.type === 'attributeCollection') {
              currentlyOpenTags.push(tag);
            } else {

            }
          } else {

          }

          break;
        case 'closing':
          depth--;
      }

      console.log(tag);
    }
  });*/
}

const d = () => {
  console.log('d');
};

const p = html`
  <div id='id'>
    <input/>
    <div class='${'my-class'}' id='test' onclick='${() => d()}'>
      <div>
        <p>hello</p>
      </div>
    </div>
    <div>
      <p>${'customText'}</p>
    </div>
  </div>
`;

function test2(): Mapping {
  return [
    createElement('p'),
  ];
}

function test(): Mapping {
  return [
    createElement('div'),
    createElement('p'),
  ];
}

render(test(), document.getElementById('root'));

//const root = new Root({}, new ComponentElement(document.body));
//root.build();
