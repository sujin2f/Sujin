import Tags from 'app/components/Tags';

import Link from 'app/components/router/Link';
import {
  parseJson,
  parseDate,
} from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/thumbnail.svg';

const { Component } = wp.element;

class Item extends Component {
  render() {
    const { item, columns } = this.props;
    const date = parseDate(item.date);
    const title = decodeURIComponent(item.title);
    const excerpt = decodeURIComponent(item.excerpt);
    const image =
      parseJson(item.meta.list, 'post-thumbnail') ||
      item.thumbnail ||
      DEFAULT_BACKGROUND;
    const className = columns ? `columns ${columns}` : 'columns large-4 medium-6 small-12';

    return (
      <div className={className}>
        <figure className="thumbnail" itemType="http://schema.org/ImageObject">
          <Link to={item.link} rel="noopener noreferrer" title={title}>
            <div className="zoom-icon" />
            <div className="inner-shadow" />
            <time dateTime={date.date}>
              <span className="day">{date.day}</span>
              <span className="month">{date.month}</span>
              <span className="year">{date.year}</span>
            </time>
            <div
              style={{ backgroundImage: `url('${image}')` }}
              className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
            />
          </Link>
        </figure>

        <h2 itemProp="headline">
          <Link
            to={item.link}
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

        <Tags tags={item.tags} />
      </div>
    );
  }
}

export default Item;
