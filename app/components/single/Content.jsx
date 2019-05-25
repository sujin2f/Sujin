import TweetEmbed from 'react-tweet-embed';
import Gist from 'react-gist';
import { Carousel } from 'react-responsive-carousel';

import Tags from 'app/components/Tags';
import Link from 'app/components/router/Link';
import { getRenderedText, parseJson } from 'app/utils/common';

const { Fragment, Component } = wp.element;

class Content extends Component {
  render() {
    const {
      post: {
        id,
        slug,
        meta,
        content,
        series,
        tags,
      },
      className,
    } = this.props;

    console.log(this.props);

    // Extract Shortcodes
    const patternShortcode = /(\[([\w-]+)[^\]]*?\][^\2]*?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/ig;
    const patternTag = /\[([\w-]+[^ ]*?)/i;
    const patternAttr1 = /[\w]+=&#[0-9]+;.+?&#[0-9]+;/ig;
    const patternAttr2 = /([\w]+)=&#[0-9]+;(.+?)&#[0-9]+;/i;

    const splited = getRenderedText(content).split(patternShortcode) || [];
    const finished = splited.map((elm) => {
      if (!elm) {
        return '';
      }

      if (elm.charAt(0) === '[' && elm.charAt(elm.length - 1) === ']') {
        const attrs = elm.match(patternAttr1).map((elm1) => {
          const attr = elm1.match(patternAttr2);
          return {
            [attr[1]]: attr[2],
          };
        }).reduce((accumulator, currentValue) => ({ ...accumulator, ...currentValue }), {});

        const tag = elm.match(patternTag);
        const patternContent = /\[([\w-]+)[^\]]*?\]([^\1]*?)\[\/[^\]]*\1\]|\[[\w-]+[^\]]*?\/\]/i;
        const tagContent = elm.match(patternContent);

        return {
          tag: tag[1],
          attrs,
          content: tagContent[2],
        };
      }

      return elm;
    }).filter(elm => elm && elm !== 'gist' && elm !== 'carousel' && elm !== 'tweet');

    let contents = [];

    // Replace Shortcodes
    /* eslint-disable react/no-array-index-key */
    contents = finished.map((elm, index) => {
      // Shortcodes
      if (typeof elm === 'object') {
        switch (elm.tag) {
          case 'tweet':
            return (<TweetEmbed id={elm.attrs.id} key={`tweet-${index}-${elm.attrs.id}`} />);
          case 'gist':
            return (
              <Gist
                id={elm.attrs.id}
                file={elm.attrs.file}
                key={`gist-${index}-${elm.attrs.id}`}
              />
            );
          case 'carousel':
            return (
              <Carousel key={`carousel-${index}`}>
                {Object.keys(elm.attrs).map((keyAttr, idxAttr) => (
                  <div key={`carousel-image-${index}-${idxAttr}-${keyAttr}`}>
                    <img src={elm.attrs[keyAttr]} alt="" />
                  </div>
                ))}
              </Carousel>
            );
          default:
            return (<Fragment key={`content-fragment-${index}`} />);
        }
      }

      /* eslint-disable react/no-danger */
      return (
        <section
          dangerouslySetInnerHTML={{ __html: elm }}
          key={`contents-${index}`}
        />
      );
      /* eslint-enable react/no-danger */
    });
    /* eslint-enable react/no-array-index-key */

    if (series && series.length > 0) {
      const seriesContent = (
        <section className="series" key="series">
          <h2>This article is a part of series</h2>
          <ul>
            {series.map((s) => {
              if (id !== s.id) {
                return (
                  <li key={`series-${s.id}`}>
                    <Link to={s.link}>{getRenderedText(s.title)}</Link>
                  </li>
                );
              }

              return (
                <li key={`series-${s.id}`}>
                  {getRenderedText(s.title)}
                </li>
              );
            })}
          </ul>
        </section>
      );

      contents.push(seriesContent);
    }

    const icon = parseJson(meta.icon);

    const contentsFirst = contents.shift();

    return (
      <article
        className={`columns ${className} post-${slug} post-${id}`}
        itemProp="mainEntity"
        itemType="http://schema.org/BlogPosting"
      >
        {icon.thumbnail &&
          <img src={icon.thumbnail} alt="Thumbnail" className="assist-thumb" />
        }

        <section className={icon.thumbnail ? 'more-margin' : ''}>
          {contentsFirst}
        </section>

        {contents}

        <Tags tags={tags} />
      </article>
    );
  }
}

export default Content;
