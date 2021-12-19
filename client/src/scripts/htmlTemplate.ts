const parseHtmlTag = (tag: string) => {
  let match: RegExpMatchArray | null;

  // eslint-disable-next-line @typescript-eslint/no-extra-parens
  if ((match = /^<#*(?<tag>\w+)#*(?:(?=>)|.*[^/])>$/gimu.exec(tag))) {
    return ['opening', Number.parseInt(match.groups?.tag ?? '-1', 10)];
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
  } else if ((match = /^<\/#*(?<tag>\w+)#*>$/gimu.exec(tag))) {
    return ['closing', Number.parseInt(match.groups?.tag ?? '-1', 10)];
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
  } else if ((match = /^<#*(?<tag>\w+)#*.*\/>$/gimu.exec(tag))) {
    return ['selfClosing', Number.parseInt(match.groups?.tag ?? '-1', 10)];
  }

  return ['unknown', -1];
};

const html = (strings: TemplateStringsArray, ...args: Array<Array<HTMLElement | SVGSVGElement> | HTMLElement | SVGSVGElement>) => {
  let combinedHtml = '';

  for (const [index, template] of strings.entries()) {
    if (index >= args.length) {
      combinedHtml += template;
    } else {
      combinedHtml += template + `###${index}###`;
    }
  }

  const htmlTags = combinedHtml
    .split(/(<[^>]+>)/gimu)
    .filter((x) => x.trim())
    // I don't understand why I need this explicit type cast...
    .map((tag) => parseHtmlTag(tag) as [string, number]);

  if (Array.isArray(args[0])) {
    throw new TypeError('The first argument cannot be an array');
  }

  let currentParent = args[0];

  // I remembered slice this time! :D
  for (const [htmlTag, argumentIndex] of htmlTags.slice(1, -1)) {
    if (argumentIndex === -1) {
      console.debug(`Unknown argumentIndex of ${argumentIndex} with tag ${htmlTag}`);
      continue;
    }

    const htmlElement = args[argumentIndex];

    switch (htmlTag) {
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
        console.debug(`Unknown tag of ${htmlTag} with argumentIndex ${argumentIndex}`);
        break;
    }
  }

  return args[0] as HTMLElement;
};

export default html;
