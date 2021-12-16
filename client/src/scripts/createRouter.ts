import {trimCharactersFromEnd} from 'Scripts/helpers';
import type {RouterArgs} from 'Types/types';

const createRouter = (args: RouterArgs[]) => {
  const path = trimCharactersFromEnd(window.location.pathname, '/');

  for (const routerArgument of args) {
    let routeRegexString = routerArgument.route.replaceAll(/\/:\w+(\/)?/gimu, '/[^/]+$1');
    routeRegexString = trimCharactersFromEnd(routeRegexString, '/');
    routeRegexString = `^${routeRegexString}$`;
    const routeRegex = new RegExp(routeRegexString, 'gimu');

    if (routeRegex.test(path)) {
      return routerArgument.name;
    }
  }

  return undefined;
};

export default createRouter;
