import SocialShare from 'app/components/single/SocialShare';
import Tags from 'app/components/Tags';
import { parseJson } from 'app/utils/common';
import { parseContent, parseSeries } from 'app/utils/content';

const { Component } = wp.element;

class Content extends Component {
  render() {
    const {
      post: {
        id,
        slug,
        meta,
        content,
        seriesPosts,
        tags,
      },
      className,
      children,
    } = this.props;

    const contents = [
      ...parseSeries(id, seriesPosts),
      ...parseContent(content),
    ];

    console.log(contents);

    const icon = parseJson(meta.icon);

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
