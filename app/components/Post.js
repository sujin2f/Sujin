import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';

import TweetEmbed from 'react-tweet-embed';
import Gist from 'react-gist';
import { Carousel } from 'react-responsive-carousel';

import RecentPostsContainer from 'app/components/Single/RecentPostsContainer';
import SocialShare from 'app/components/Single/SocialShare';
import Tags from 'app/components/Common/Tags';
import PostFooter from 'app/components/Single/SingleFooter';
import PageHeader from 'app/components/Layout/PageHeader';
import Loading from 'app/components/Common/Loading';
import Link from 'src/components/Link';
import { getImages, getRenderedText, getLink } from 'app/utils/common';

class Post extends Component {
  componentDidMount() {
    const {
      push,
      params: { postSlug },
      getPost,
      cancelToken,
      resetMobileMenu,
    } = this.props;

    getPost(postSlug, push, cancelToken);
    resetMobileMenu();
  }

  componentWillReceiveProps(nextProps) {
    const {
      push,
      params,
      getPost,
      cancelToken,
      resetMobileMenu,
    } = nextProps;

    const update = this.props.params.year !== params.year
      || this.props.params.month !== params.month
      || this.props.params.day !== params.day
      || this.props.params.postSlug !== params.postSlug;

    if (update) {
      getPost(params.postSlug, push, cancelToken);
      resetMobileMenu();
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.id !== this.props.id || nextProps.series !== this.props.series;
  }

  render() {
    if (this.props.loading) {
      return (<PageHeader text={<Loading />} />);
    }

    const {
      id,
      slug,
      content,
      excerpt,
      title,
      tags,
      thumbnail,
      meta,
      link,
      series,
    } = this.props;

    const rTitle = getRenderedText(title);
    const rExcerpt = getRenderedText(excerpt);

    // Extract Shortcodes
    const patternShortcode = /(\[([\w-]+)[^\]]*?\][^\2]*?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/ig;
    const patternTag = /\[([\w-]+[^ ]*?)/i;
    const patternAttr1 = /[\w]+=&#[0-9]+;.+?&#[0-9]+;/ig;
    const patternAttr2 = /([\w]+)=&#[0-9]+;(.+?)&#[0-9]+;/i;

    const images = getImages(thumbnail, meta);

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

    const descriptionString = rExcerpt
      .replace(/<p>|<\/p>/g, '')
      .replace(/\+/g, ' ')
      .replace(/\n/g, '<br />');

    const h1 = images.title
      ? (<img src={images.title} alt={rTitle} />)
      : (<span dangerouslySetInnerHTML={{ __html: rTitle }} />);

    const headerText = (
      <Fragment>
        <h1>{h1}</h1>
        <p dangerouslySetInnerHTML={{ __html: descriptionString }} />
      </Fragment>
    );

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

      return (
        <section
          dangerouslySetInnerHTML={{ __html: elm }}
          key={`contents-${index}`} />
      );
    });
    /* eslint-enable react/no-array-index-key */

    if (series.length > 0) {
      const seriesContent = (
        <section className="series" key="series">
          <h2>This article is a part of series</h2>
          <ul>
            {series.map((s) => {
              if (id !== s.id) {
                return (
                  <li key={`series-${s.id}`}>
                    <Link href={getLink(s.link)}>{getRenderedText(s.title)}</Link>
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

    const contentsFirst = contents.shift();

    return (
      <Fragment>
        <Helmet>
          <title>Sujin | {rTitle}</title>
          <meta content={descriptionString.replace(/<(?:.|\n)*?>/gm, '')} name="description" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={`Sujin | ${rTitle}`} />
          <meta
            property="og:description"
            content={descriptionString.replace(/<(?:.|\n)*?>/gm, '')}
          />
          <meta property="og:image" content={images.openGraph} />
          <meta property="og:url" content={getLink(link)} />
        </Helmet>

        <PageHeader
          style={{
            backgroundImage: `url(${images.large})`,
          }}
          text={headerText}
          background={images.background}
        />

        <section className="row">
          <article
            className={`columns large-9 medium-12 post-${slug} post-${id}`}
            itemProp="mainEntity"
            itemType="http://schema.org/BlogPosting"
            >
            {images.small &&
              <img src={images.small} alt="Thumbnail" className="assist-thumb" />
            }

            <section className={images.small ? 'more-margin' : ''}>
              {contentsFirst}
            </section>

            {contents}

            <Tags tags={tags} />
            <SocialShare title={rTitle} excerpt={rExcerpt} thumbnail={images.list} />
          </article>

          <aside id="recent-posts" className="columns large-3 show-for-large">
            <header>
              <h2 className="section-header">Recent Posts</h2>
            </header>

            <RecentPostsContainer />
          </aside>
        </section>

        <PostFooter prevnext={this.props.prevnext} postId={id} />
      </Fragment>
    );
  }
}

export default Post;
