import React from 'react';

import { Link } from "react-router-dom";

import { Gist } from 'components/single/Gist';
import { TweetEmbed } from 'components/single/TweetEmbed';

import { CaseTool } from 'components/dev-tools/CaseTool';
import { TextSort } from 'components/dev-tools/TextSort';
import { SymbolAlignment } from 'components/dev-tools/SymbolAlignment';

import DEFAULT_BACKGROUND from 'assets/images/thumbnail.svg';

interface UrlArgs {
  [key: string]: string;
}

/**
 * Generate a RegExp to identify a shortcode.
 *
 * @param {string} tag Shortcode tag.
 *
 * @return {RegExp} Shortcode RegExp.
 */
const regexp = (tag: string): RegExp => {
	return new RegExp(
		'\\[(\\[?)(' +
			tag +
			')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)',
		'g'
	);
};

/**
 * Parse shortcode attributes.
 * @param {string} text Serialised shortcode attributes.
 *
 * @return {any} Parsed shortcode attributes.
 */
const attrs = (text) => {
	const named = {};
	const numeric = [];

	// This regular expression is reused from `shortcode_parse_atts()` in
	// `wp-includes/shortcodes.php`.
	//
	// Capture groups:
	//
	// 1. An attribute name, that corresponds to...
	// 2. a value in double quotes.
	// 3. An attribute name, that corresponds to...
	// 4. a value in single quotes.
	// 5. An attribute name, that corresponds to...
	// 6. an unquoted value.
	// 7. A numeric attribute in double quotes.
	// 8. A numeric attribute in single quotes.
	// 9. An unquoted numeric attribute.
	const pattern = /([\w-]+)\s*=\s*"([^"]*)"(?:\s|$)|([\w-]+)\s*=\s*'([^']*)'(?:\s|$)|([\w-]+)\s*=\s*([^\s'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|'([^']*)'(?:\s|$)|(\S+)(?:\s|$)/g;

	// Map zero-width spaces to actual spaces.
	text = text.replace( /[\u00a0\u200b]/g, ' ' );

	let match;

	// Match and normalize attributes.
  // tslint:disable:no-conditional-assignment
  /* eslint-disable no-cond-assign */
	while (match = pattern.exec(text)) {
		if (match[1]) {
			named[match[1].toLowerCase() ] = match[2];
		} else if (match[3]) {
			named[match[3].toLowerCase()] = match[4];
		} else if (match[5]) {
			named[match[5].toLowerCase()] = match[6];
		} else if (match[7]) {
			numeric.push(match[7]);
		} else if (match[8]) {
			numeric.push(match[8]);
		} else if (match[9]) {
			numeric.push(match[9]);
		}
	}
  // tslint:enable:no-conditional-assignment
  /* eslint-enable no-cond-assign */

	return { named, numeric };
};

const addQueryArgs = (url: string, args: UrlArgs) => {
  const parsed = new URL(url);
  Object.keys(args).map(key => parsed.searchParams.append(key, args[key]));
  return `${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
};

const replaceQuotes = (matched, key) => {
  const regex = /(&#8221;|&#8243;|\/\])/g;
  return (matched[key] && matched[key].replace(regex, '')) || '';
};

export function parseContent(content) {
  const patternShortcode = /(\[([\w-]+)[^\]]*?\][^\2]*?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/ig;
  const str = content;

  let matched = {};
  let splited = (content.split(patternShortcode) || [])
    .filter((v) => v);

  matched = (str.match(regexp('gist')) || [])
    .reduce((acc, value) => ({
      ...acc,
      [value]: attrs(value),
    }), matched);

  matched = (str.match(regexp('tweet')) || [])
    .reduce((acc, value) => ({
      ...acc,
      [value]: attrs(value),
    }), matched);

  matched = (str.match(regexp('dev-tools')) || [])
    .reduce((acc, value) => ({
      ...acc,
      [value]: attrs(value),
    }), matched);

  splited = splited.map((value, index) => {
    if (matched[value]) {
      if (value.indexOf('[gist') === 0) {
        const id = replaceQuotes(matched[value].named, 'id');
        const file = replaceQuotes(matched[value].named, 'file');

        return (
          <Gist
            id={id}
            file={file}
            key={`content-element__gist__${id}__${index}`}
          />
        );
      }

      if (value.indexOf('[tweet') === 0) {
        const id = replaceQuotes(matched[value].named, 'id');
        return (
          <TweetEmbed
            id={id}
            key={`content-element__tweet__${id}__${index}`}
          />
        );
      }

      if (value.indexOf('[dev-tools') === 0) {
        const id = replaceQuotes(matched[value].named, 'id');
        switch (id) {
          case 'text-sort':
            return (
              <TextSort key={`content-element__text-sort__${index}`} />
            );
          case 'symbol-alignment':
            return (
              <SymbolAlignment key={`content-element__text-sort__${index}`} />
            );
          case 'case-tool':
          default:
            return (
              <CaseTool key={`content-element__case-tool__${index}`} />
            );
        }
      }
    }

    return (
      <section
        className="layout__main__content"
        dangerouslySetInnerHTML={{ __html: value }}
        key={`content-element__section__${index}`}
      />
    );
  });

  return splited;
}

export function parseSeries(id, seriesPosts) {
  if (!seriesPosts || seriesPosts.length === 0) {
    return [];
  }

  return [(
    <section className="series" key="series">
      <h2><span>Series</span></h2>
      <ul>
        {seriesPosts.map((item) => {
          if (id !== item.id) {
            return (
              <li key={`series__${item.id}`}>
                <Link to={item.link}>{item.title}</Link>
              </li>
            );
          }

          return (
            <li key={`series__${item.id}`}>
              {item.title}
            </li>
          );
        })}
      </ul>
    </section>
  )];
}

const getNewWindowFeatures = () => {
  const top = (window.innerHeight - 600) / 2;
  const left = (window.innerWidth - 500) / 2;
  return `toolbar=0,status=0,resizable=yes,width=500,height=600,top=${top},left=${left}`;
};

export const shareTwitter = (title) => {
  const url = addQueryArgs(
    'https://www.twitter.com:8800/intent/tweet',
    {
      text: (title && encodeURIComponent(title)) || '',
      url: window.location.href,
    },
  );

  window.open(url, 'Twitter', getNewWindowFeatures());
};

export const shareFacebook = (title, excerpt, thumbnail) => {
  const url = addQueryArgs(
    'https://www.facebook.com/sharer/sharer.php',
    {
      u: window.location.href,
      picture: thumbnail || DEFAULT_BACKGROUND,
      text: (title && encodeURIComponent(title)) || '',
      quote: (excerpt && encodeURIComponent(excerpt)) || '',
    },
  );

  window.open(url, 'Facebook', getNewWindowFeatures());
};
