/** app/components/archive/Item */

// Items
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
  thumbnailKey?: {
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
  render(): JSX.Element {
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
      columns,
      thumbnailKey = {},
    } = this.props;

    const backgroundImage =
      parseExImage(
        meta.list,
        thumbnail,
        thumbnailKey.desktop || 'medium',
        thumbnailKey.mobile || 'small',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND,
      );

    const className = columns || 'large-4 medium-6 small-12';

    return (
      <div className={`columns list-item ${className}`}>
        <figure className="thumbnail" itemType="http://schema.org/ImageObject">
          <Link to={link} rel="noopener noreferrer" title={title}>
            <div className="zoom-icon" />
            <div className="inner-shadow" />
            <time dateTime={new Date(date).toString()}>
              <span className="day">{this.props.item.parseDate().day}</span>
              <span className="month">{this.props.item.parseDate().month}</span>
              <span className="year">{this.props.item.parseDate().year}</span>
            </time>
            <div
              style={{ backgroundImage: `url('${backgroundImage}')` }}
              className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
            />
          </Link>
        </figure>

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
    );
  }
}

export default compose([])(Item);
