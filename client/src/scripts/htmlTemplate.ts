import type {HtmlTagResult} from 'Types/types';

const parseHtmlTag = (tag: string): HtmlTagResult => {
  let match: RegExpMatchArray | null;

  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  if ((match = /^<(?<tag>\w+)(?:(?=>)|.*[^/])>$/gimu.exec(tag))) {
    return {
      literalArgumentIndex: Number.parseInt(match.groups?.tag ?? '-1', 10),
      tagType: 'opening',
    };
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
  } else if ((match = /^<\/(?<tag>\w+)>$/gimu.exec(tag))) {
    return {
      literalArgumentIndex: Number.parseInt(match.groups?.tag ?? '-1', 10),
      tagType: 'closing',
    };
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
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
  ...args: Array<Array<HTMLElement | SVGSVGElement> | HTMLElement | SVGSVGElement>) => {
  if (Array.isArray(args[0])) {
    throw new TypeError('The first argument cannot be an array');
  }

  /*
  The strings array is split upon every argument passed to the template literal.
  Since the expected format of the code is supposed to be HTML, I need to rebuild
  the HTML, so I can parse the type of each tag, opening, closing or self-closing.
   */

  const htmlTags = strings
    .reduce((previous, current, index) => previous + (index - 1) + current)
    .split(/(<[^>]+>)/gimu)
    .filter((tag) => tag.trim())
    .map((tag) => parseHtmlTag(tag));

  let currentParent = args[0];

  // I remembered slice this time! :D
  for (const htmlTagParseResult of htmlTags.slice(1, -1)) {
    if (htmlTagParseResult.literalArgumentIndex === -1) {
      console.debug(`Unknown argumentIndex of ${htmlTagParseResult.literalArgumentIndex} with tag ${htmlTagParseResult.tagType}`);
      continue;
    }

    const htmlElement = args[htmlTagParseResult.literalArgumentIndex];

    switch (htmlTagParseResult.tagType) {
      case 'opening':
        if (Array.isArray(htmlElement)) {
          throw new TypeError('An opening tag should not be an array');
        }

        currentParent.append(htmlElement);
        currentParent = htmlElement;

        break;
      case 'closing':
        if (currentParent.parentElement) {
          currentParent = currentParent.parentElement;
        }

        break;
      case 'selfClosing':
        if (Array.isArray(htmlElement)) {
          currentParent.append(...htmlElement);
        } else {
          currentParent.append(htmlElement);
        }

        break;
      default:
        console.debug(`Unknown tag of ${htmlTagParseResult.tagType} with argumentIndex ${htmlTagParseResult.literalArgumentIndex}`);
        break;
    }
  }

  return args[0] as HTMLElement;
};

export default htmlx;
