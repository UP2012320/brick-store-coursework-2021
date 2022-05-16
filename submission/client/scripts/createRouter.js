const createRouter = (args) => {
  const path = window.location.pathname;
  for (const routerArgument of args) {
    const qsMatches = routerArgument.route.matchAll(/\/:(?<name>\w+)(\/)?/gimu);
    let routeRegexString = routerArgument.route;
    routeRegexString = routeRegexString.replace(/(\/)(?=\*)/gimu, '$1?');
    routeRegexString = routeRegexString.replace('*', '.*');
    for (const qsMatch of qsMatches) {
      routeRegexString = routeRegexString.replace(qsMatch[0], `/(?<${qsMatch[1]}>[^/]+)`);
    }
    routeRegexString = `^${routeRegexString}/?$`;
    const routeRegex = new RegExp(routeRegexString, 'gimu');
    let result;
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    if ((result = routeRegex.exec(path))) {
      return [routerArgument.name, result.groups, new URLSearchParams(window.location.search)];
    }
  }
  return [undefined, undefined, undefined];
};
export default createRouter;
