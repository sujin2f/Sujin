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
        type,
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
        className={`columns ${className} ${type}-${slug} post-${id}`}
        itemProp="mainEntity"
        itemType="http://schema.org/BlogPosting"
      >
        {icon && (<img src={icon} alt="Thumbnail" className="assist-thumb" />)}

        <section className={icon ? 'more-margin' : ''}>
          {contents}
        </section>

        {children}
      </article>
    );
  }
}

export default Content;
