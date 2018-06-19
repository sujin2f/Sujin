import React, { Component } from 'react';

import Link from 'src/components/Link';
import Tags from 'app/components/Common/Tags';

import { getLink, getImages, getRenderedText } from 'app/utils/common';

class ArchiveEntity extends Component {
  render() {
    const { entity, className } = this.props;

    const images = getImages(entity.thumbnail, entity.meta);

    const date = new Date(entity.date || entity.post_date);
    const locale = 'en-us';

    const day = date.getDate();
    const month = date.toLocaleString(locale, { month: 'short' });
    const year = date.getFullYear();

    let link = getLink(entity.link);
    let newWindow = false;
    if (entity.redirect) {
      link = entity.redirect;
      newWindow = true;
    }

    const columns = this.props.columns || 'large-4 medium-6 small-12';

    return (
      <div className={`columns column-block post post-${entity.id} ${columns} ${className}`}>
        <figure className="thumbnail" itemType="http://schema.org/ImageObject">
          <Link
            href={link}
            rel="noopener noreferrer"
            target={newWindow ? '_blank' : ''}
            title={decodeURIComponent(getRenderedText(entity.title))}
            >
            <div className="zoom-icon"><i className="fa fa-search" aria-hidden="true" /></div>
            <div className="inner-shadow" />
            <time dateTime={entity.date}>
              <span className="day">{day}</span>
              <span className="month">{month}</span>
              <span className="year">{year}</span>
            </time>
            <div
              style={{ backgroundImage: `url('${images.list}')` }}
              className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
            />
          </Link>
        </figure>

        <h2 itemProp="headline">
          <Link
            href={link}
            rel="noopener noreferrer"
            target={newWindow ? '_blank' : ''}
            title={decodeURIComponent(getRenderedText(entity.title))}
            dangerouslySetInnerHTML={{ __html: getRenderedText(entity.title) }}
          />
        </h2>

        <div
          itemProp="description"
          className="description"
          dangerouslySetInnerHTML={{ __html: getRenderedText(entity.excerpt) }}
        />

        <Tags tags={entity.tags} />
      </div>
    );
  }
}

export default ArchiveEntity;
