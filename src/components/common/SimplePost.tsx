/*
 * Simple Post Component
 * components/common/SimplePost
 */

import React from 'react';

import DEFAULT_BG from 'assets/images/thumbnail.svg';
import { Link } from "components/common/Link";
import { Tags } from 'components/common/Tags';
import { SimplePost as SimplePostType } from 'store/items/schema/simple-post';
import { parseExImage } from 'utils/common';

interface Props {
  item: SimplePostType;
  className?: string;
  thumbnailKey?: {
    desktop?: string;
    mobile?: string;
  };
}

export const SimplePost = (props: Props): JSX.Element => {
  const {
    item: {
      title,
      thumbnail,
      link,
      date,
      meta,
      excerpt,
      tags,
    },
    className,
    thumbnailKey = {},
  } = props;

  const backgroundImage =
    parseExImage(
      meta.list,
      thumbnail,
      thumbnailKey.desktop || 'medium',
      thumbnailKey.mobile || 'small',
      DEFAULT_BG,
      DEFAULT_BG,
    );

  return (
    <div className={`simple-post ${className}`}>
      <figure className="thumbnail" itemType="http://schema.org/ImageObject">
        <Link to={link} rel="noopener noreferrer" title={title}>
          <div className="zoom-icon" />
          <div className="inner-shadow" />
          <time dateTime={new Date(date).toString()}>
            <span className="day">{props.item.parseDate().day}</span>
            <span className="month">{props.item.parseDate().month}</span>
            <span className="year">{props.item.parseDate().year}</span>
          </time>
          <div
            style={{ backgroundImage: `url('${backgroundImage}')` }}
            className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
          />
        </Link>
      </figure>

      <div>
        <h2 itemProp="headline">
          <Link
            to={link}
            rel="noopener noreferrer"
            title={title}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </h2>

        <div
          itemProp="description"
          className="description"
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />

        <Tags tags={tags} from={`archive-item-${title}`} />
      </div>
    </div>
  );
};
