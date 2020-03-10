import hash from 'object-hash';

import Gist from 'app/components/single/Gist';
import TweetEmbed from 'app/components/single/TweetEmbed';

import Link from 'app/components/router/Link';
import CaseTool from 'app/components/dev-tools/CaseTool';
import TextSort from 'app/components/dev-tools/TextSort';
import SymbolAlignment from 'app/components/dev-tools/SymbolAlignment';

import DEFAULT_BACKGROUND from '../../assets/images/thumbnail.svg';

const { regexp, attrs } = wp.shortcode;
const { addQueryArgs } = wp.url;

/* eslint-disable import/prefer-default-export */

const replaceQuotes = (matched, key) => {
  const regex = /(&#8221;|&#8243;|\/\])/g;
  return (matched[key] && matched[key].replace(regex, '')) || '';
};

export function parseContent(content) {
  const patternShortcode = /(\[([\w-]+)[^\]]*?\][^\2]*?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/ig;
  const string = content;

  let matched = {};
  let splited = (content.split(patternShortcode) || [])
    .filter((v) => v);

  matched = (string.match(regexp('gist')) || [])
    .reduce((acc, value) => ({
      ...acc,
      [value]: attrs(value),
    }), matched);

  matched = (string.match(regexp('tweet')) || [])
    .reduce((acc, value) => ({
      ...acc,
      [value]: attrs(value),
    }), matched);

  matched = (string.match(regexp('dev-tools')) || [])
    .reduce((acc, value) => ({
      ...acc,
      [value]: attrs(value),
    }), matched);

  splited = splited.map((value) => {
    if (matched[value]) {
      if (value.indexOf('[gist') === 0) {
        const id = replaceQuotes(matched[value].named, 'id');
        const file = replaceQuotes(matched[value].named, 'file');

        return (
          <Gist
            id={id}
            file={file}
            key={hash(value)}
          />
        );
      }

      if (value.indexOf('[tweet') === 0) {
        const id = replaceQuotes(matched[value].named, 'id');
        return (
          <TweetEmbed
            id={id}
            key={hash(value)}
          />
        );
      }

      if (value.indexOf('[dev-tools') === 0) {
        const id = replaceQuotes(matched[value].named, 'id');
        switch (id) {
          case 'text-sort':
            return (
              <TextSort key={hash(value)} />
            );
          case 'symbol-alignment':
            return (
              <SymbolAlignment key={hash(value)} />
            );
          case 'case-tool':
          default:
            return (
              <CaseTool key={hash(value)} />
            );
        }
      }
    }

    return (
      <section
        dangerouslySetInnerHTML={{ __html: value }}
        key={hash(value)}
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
              <li key={`series-${hash(item.id)}`}>
                <Link to={item.link}>{item.title}</Link>
              </li>
            );
          }

          return (
            <li key={`series-${hash(item.id)}`}>
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
    'https://www.twitter.com/intent/tweet',
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

/* eslint-enable import/prefer-default-export */
