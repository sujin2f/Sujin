import Tags from 'app/components/Tags';

import Link from 'app/components/router/Link';
import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/thumbnail.svg';

const { Component } = wp.element;

class Item extends Component {
  render() {
    const {
      item,
      columns,
      thumbnail = {},
    } = this.props;

    const backgroundImage =
      parseExImage(
        item.meta.list,
        item.thumbnail,
        thumbnail.desktop || 'post-thumbnail',
        thumbnail.mobile || 'post-thumbnail',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND,
      );
    const className = columns ? `columns ${columns}` : 'columns large-4 medium-6 small-12';

    return (
      <div className={className}>
        <figure className="thumbnail" itemType="http://schema.org/ImageObject">
          <Link to={item.link} rel="noopener noreferrer" title={item.title}>
            <div className="zoom-icon" />
            <div className="inner-shadow" />
            <time dateTime={item.date}>
              <span className="day">{item.parseDate().day}</span>
              <span className="month">{item.parseDate().month}</span>
              <span className="year">{item.parseDate().year}</span>
            </time>
            <div
              style={{ backgroundImage: `url('${backgroundImage}')` }}
              className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
            />
          </Link>
        </figure>

        <h2 itemProp="headline">
          <Link
            to={item.link}
            rel="noopener noreferrer"
            title={item.title}
            dangerouslySetInnerHTML={{ __html: item.title }}
          />
        </h2>

        <div
          itemProp="description"
          className="description"
          dangerouslySetInnerHTML={{ __html: item.excerpt }}
        />

        <Tags tags={item.tags} />
      </div>
    );
  }
}

export default Item;
