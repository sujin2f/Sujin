import React, { Component, Fragment } from 'react';
import Helmet from 'react-helmet';

import PageHeader from 'app/components/Layout/PageHeader';
import Loading from 'app/components/Common/Loading';
import SocialShare from 'app/components/Single/SocialShare';
import { getImages, getRenderedText, getLink } from 'app/utils/common';

class Page extends Component {
  componentDidMount() {
    const {
      push,
      params: { pageSlug },
      getPage,
      cancelToken,
      resetMobileMenu,
    } = this.props;

    getPage(pageSlug, push, cancelToken);
    resetMobileMenu();
  }

  componentWillReceiveProps(nextProps) {
    const {
      push,
      params: { pageSlug },
      getPage,
      cancelToken,
      resetMobileMenu,
    } = nextProps;

    if (this.props.params.pageSlug !== pageSlug) {
      getPage(pageSlug, push, cancelToken);
      resetMobileMenu();
    }
  }

  render() {
    if (this.props.loading) {
      return (<PageHeader text={<Loading />} />);
    }

    const {
      id,
      slug,
      title,
      content,
      excerpt,
      thumbnail,
      meta,
      link,
    } = this.props;

    const images = getImages(thumbnail, meta);
    const rTitle = getRenderedText(title);
    const rExcerpt = getRenderedText(excerpt).replace(/<(?:.|\n)*?>/gm, '');

    const text = (
      <Fragment>
        <h1>{rTitle}</h1>
        <p>{rExcerpt}</p>
      </Fragment>
    );

    return (
      <Fragment>
        <Helmet>
          <title>Sujin | {rTitle}</title>
          <meta name="description" content={rExcerpt} />
          <meta property="og:type" content="article" />
          <meta property="og:title" content={`Sujin | ${rTitle}`} />
          <meta property="og:description" content={rExcerpt} />
          <meta property="og:image" content={images.openGraph} />
          <meta property="og:url" content={getLink(link)} />
        </Helmet>

        <PageHeader
          style={{ backgroundImage: `url('${images.large}')` }}
          text={text}
        />

        <section className="row">
          <article
            className={`columns large-12 page-${slug} page-${id}`}
            itemProp="mainEntity"
            itemType="http://schema.org/BlogPosting"
            >
            {images.small &&
              <img src={images.small} alt="Thumbnail" className="assist-thumb" />
            }
            <section
              className={images.small ? 'more-margin' : ''}
              dangerouslySetInnerHTML={{ __html: getRenderedText(content) }}
            />

            <SocialShare title={rTitle} excerpt={rExcerpt} thumbnail={images.list} />
          </article>
        </section>
      </Fragment>
    );
  }
}

export default Page;
