import pathToRegexp from 'path-to-regexp';

/* eslint-disable import/prefer-default-export */

export function getMatched(path, url) {
  const regExp = new RegExp(pathToRegexp(path));
  const matchedResult = regExp.exec(url);

  const pathname = path.split('/')
    .filter(p => p.charAt(0) === ':')
    .map(p => p.slice(1).replace(/\?|(\(.+\))/, ''));

  const matched = matchedResult && pathname.reduce((acc, value, index) => ({
    ...acc,
    [value]: matchedResult[index + 1],
  }), { matched: true });

  return {
    matched,
    pathname,
  };
}

/* eslint-enable import/prefer-default-export */
