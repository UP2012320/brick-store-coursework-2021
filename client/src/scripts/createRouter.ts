import {trimCharactersFromEnd} from 'Scripts/helpers';
import type {RouterArgs} from 'Types/types';

const createRouter = (args: RouterArgs[]): [string | undefined, Record<string, string> | undefined] => {
  const path = trimCharactersFromEnd(window.location.pathname, '/');

  for (const routerArgument of args) {
    const qsMatches = routerArgument.route.matchAll(/\/:(?<name>\w+)(\/)?/gimu);

    let routeRegexString = routerArgument.route;

    for (const qsMatch of qsMatches) {
      routeRegexString = routeRegexString.replace(qsMatch[0], `/(?<${qsMatch[1]}>[^/]+)`);
    }

    routeRegexString = trimCharactersFromEnd(routeRegexString, '/');
    routeRegexString = `^${routeRegexString}$`;

    const routeRegex = new RegExp(routeRegexString, 'gimu');

    let result;

    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    if ((result = routeRegex.exec(path))) {
      return [routerArgument.name, result.groups];
    }
  }

  return [undefined, undefined];
};

export default createRouter;
