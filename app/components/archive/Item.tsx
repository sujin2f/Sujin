/** app/components/archive/Item */

// Items
import { IImage } from 'app/items/rest/interface/image';
import { ISimplePost } from 'app/items/rest/interface/simple-post';

// Components
import Tags from 'app/components/Tags';
import Link from 'app/components/router/Link';

// Functions
import { parseExImage } from 'app/utils/common';

// Images
import DEFAULT_BACKGROUND from '../../../assets/images/thumbnail.svg';

// Wordpress
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  item: ISimplePost;
  columns?: string;
  thumbnail?: {
    desktop?: string;
    mobile?: string;
  };
}

/*
 * List Item
 *
 * @todo Refactor parseExImage()
 */
class Item extends Component<Props> {
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
        thumbnail.desktop || 'medium',
        thumbnail.mobile || 'small',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND,
      );

    const className = columns || 'large-4 medium-6 small-12';

    return (
      <div className={`columns ${className}`}>
        <figure className="thumbnail" itemType="http://schema.org/ImageObject">
          <Link to={item.link} rel="noopener noreferrer" title={item.title}>
            <div className="zoom-icon" />
            <div className="inner-shadow" />
            <time dateTime={new Date(item.date)}>
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

export default compose([])(Item);
