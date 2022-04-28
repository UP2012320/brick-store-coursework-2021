import {appendElements} from 'Scripts/uiUtils';
import {type HtmlTagResult, type HTMLXBody} from 'Types/types';

const parseHtmlTag = (tag: string): HtmlTagResult => {
  let match: RegExpMatchArray | null;

  if ((match = /^<(?<tag>\w+)(?:(?=>)|.*[^/])>$/gimu.exec(tag))) {
    return {
      literalArgumentIndex: Number.parseInt(match.groups?.tag ?? '-1', 10),
      tagType: 'opening',
    };
  } else if ((match = /^<\/(?<tag>\w+)>$/gimu.exec(tag))) {
    return {
      literalArgumentIndex: Number.parseInt(match.groups?.tag ?? '-1', 10),
      tagType: 'closing',
    };
  } else if ((match = /^<(?<tag>\w+).*\/>$/gimu.exec(tag))) {
    return {
      literalArgumentIndex: Number.parseInt(match.groups?.tag ?? '-1', 10),
      tagType: 'selfClosing',
    };
  }

  return {
    literalArgumentIndex: -1,
    tagType: 'unknown',
  };
};

const htmlx = (strings: TemplateStringsArray,
  ...args: HTMLXBody[]) => {
  if (Array.isArray(args[0])) {
    // eslint-disable-next-line unicorn/prefer-type-error
    throw new Error('The first argument cannot be an array');
  }

  /*
  reduce - Merge all the seperated strings and the corresponding index - 1, this index that'll be parsed
  later on corresponds with an argument in the args array
  match - Match all html tags in the reduced string
  map - Pass each matched tag to function used to parse and identify the tag
   */

  const htmlTags = strings
    .reduce((previous, current, index) => previous + (index - 1) + current)
    .match(/(<[^>]+>)/gimu)
    ?.map((tag) => parseHtmlTag(tag));

  if (!htmlTags) {
    return null;
  }

  let currentParent = args[0];

  if (!currentParent) {
    return null;
  }

  // I remembered slice this time! :D
  // The reason we slice here is that the first and last tags will be related to args[0] which is what we start off with above
  for (const htmlTagParseResult of htmlTags.slice(1, -1)) {
    if (htmlTagParseResult.literalArgumentIndex === -1) {
      console.debug(`Unknown argumentIndex of ${htmlTagParseResult.literalArgumentIndex} with tag ${htmlTagParseResult.tagType}`);
      continue;
    }

    const htmlElement = args[htmlTagParseResult.literalArgumentIndex];

    switch (htmlTagParseResult.tagType) {
      case 'opening':
        if (Array.isArray(htmlElement)) {
          // eslint-disable-next-line unicorn/prefer-type-error
          throw new Error('An opening tag should not be an array');
        }

        appendElements(currentParent, htmlElement);
        currentParent = htmlElement;

        break;
      case 'closing':
        if (currentParent?.parentElement) {
          currentParent = currentParent.parentElement;
        }

        break;
      case 'selfClosing':
        if (Array.isArray(htmlElement)) {
          appendElements(currentParent, ...htmlElement);
        } else {
          appendElements(currentParent, htmlElement);
        }

        break;
      default:
        console.debug(`Unknown tag of ${htmlTagParseResult.tagType} with argumentIndex ${htmlTagParseResult.literalArgumentIndex}`);
        break;
    }
  }

  // Return the first argument as that'll always be the root node all child nodes are appended to

  return args[0] as HTMLElement;
};

export default htmlx;
