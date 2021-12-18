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

const html = (strings: TemplateStringsArray, ...args: HTMLElement[]) => {
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
    .filter((x) => {
      return x.trim();
    })
    .map((tag) => {
      // I don't understand why I need this explicit type cast...
      return parseHtmlTag(tag) as [string, number];
    });

  let currentParent = args[0];

  for (const [htmlTag, argumentIndex] of htmlTags.slice(1, -1)) {
    if (argumentIndex === -1) {
      continue;
    }

    const htmlElement = args[argumentIndex];

    switch (htmlTag) {
      case 'opening':
        currentParent.append(htmlElement);
        currentParent = htmlElement;
        break;
      case 'closing':
        if (currentParent.parentElement) {
          currentParent = currentParent.parentElement;
        }

        break;
      case 'selfClosing':
        currentParent.append(htmlElement);
        break;
      default:
        console.debug(`Unknown tag of ${htmlTag} of argIndex ${argumentIndex}`);
        break;
    }
  }

  return args[0];
};

export default html;
