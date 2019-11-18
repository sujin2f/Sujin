import SocialShare from 'app/components/single/SocialShare';
import Tags from 'app/components/Tags';
import { parseContent, parseSeries } from 'app/utils/single';

const { Component } = wp.element;

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
        postType,
      },
      className,
      children,
    } = this.props;

    const contents = [
      ...parseSeries(id, series),
      ...parseContent(content),
    ];

    const icon = meta.icon.small;

    return (
      <article
        className={`columns ${className} ${postType}-${slug} post-${id}`}
        itemProp="mainEntity"
        itemType="http://schema.org/BlogPosting"
      >
        {icon && (<img src={icon} alt="Thumbnail" className="assist-thumb" />)}

        <section className={icon ? 'more-margin' : ''}>
          {contents}
        </section>

        <Tags tags={tags} />

        <SocialShare />

        {children}
      </article>
    );
  }
}

export default Content;
