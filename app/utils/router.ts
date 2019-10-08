import Matched from 'app/types/matched';
import pathToRegexp from 'path-to-regexp';

/* eslint-disable import/prefer-default-export */

export function parseMatched(path: string, url: string): Matched {
  const regExp = new RegExp(pathToRegexp(path));
  const matchedResult = regExp.exec(url);
  const pathname = path.split('/')
    .filter(p => p.charAt(0) === ':')
    .map(p => p.slice(1).replace(/\?|(\(.+\))/, ''));

  const matched = matchedResult && pathname.reduce((acc, value, index) => ({
    ...acc,
    [value]: matchedResult[index + 1],
  }), { matched: true });

  return new Matched(matched || {});
}

/* eslint-enable import/prefer-default-export */
