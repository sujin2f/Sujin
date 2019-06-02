import hash from 'object-hash';

import TweetEmbed from 'react-tweet-embed';
import Gist from 'react-gist';
import { Carousel } from 'react-responsive-carousel';

import Link from 'app/components/router/Link';

import { getRenderedText } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../assets/images/thumbnail.svg';


const { regexp, attrs } = wp.shortcode;
const { addQueryArgs } = wp.url;

/* eslint-disable import/prefer-default-export */

export function parseContent(content) {
  const patternShortcode = /(\[([\w-]+)[^\]]*?\][^\2]*?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/ig;
  const string = getRenderedText(content);

  let matched = {};
  let splited = (string.split(patternShortcode) || [])
    .filter(v => v);

  matched = (string.match(regexp('carousel')) || [])
    .reduce((acc, value) => ({
      ...acc,
      [value]: attrs(value),
    }), matched);

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

  splited = splited.map((value) => {
    if (matched[value]) {
      if (value.indexOf('[carousel') === 0) {
        return (
          <Carousel key={hash(value)}>
            {Object.keys(matched[value].named).map((keyCarousel) => (
              <div key={hash(matched[value].named[keyCarousel])}>
                <img
                  src={matched[value].named[keyCarousel].replace(/(&#8221;|&#8243;)/g, '')}
                  alt=""
                />
              </div>
            ))}
          </Carousel>
        );
      }

      if (value.indexOf('[gist') === 0) {
        return (
          <Gist
            id={matched[value].named.id.replace(/(&#8221;|&#8243;)/g, '')}
            file={matched[value].named.file.replace(/(&#8221;|&#8243;)/g, '')}
            key={hash(value)}
          />
        );
      }

      if (value.indexOf('[tweet') === 0) {
        return (
          <TweetEmbed
            id={matched[value].named.id.replace(/(&#8221;|&#8243;)/g, '')}
            key={hash(value)}
          />
        );
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
      <h2>Series</h2>
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
