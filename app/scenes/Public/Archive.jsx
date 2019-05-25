import axios from 'axios';

import Public from 'app/scenes/Public';
import PageHeader from 'app/components/layout/PageHeader';
import Loading from 'app/components/layout/Loading';
import Tags from 'app/components/Tags';

import Link from 'app/components/router/Link';
import { STORE, IS_ERROR } from 'app/constants/common';
import {
  getRenderedText,
  parseJson,
  parseDate,
} from 'app/utils/common';

const { Fragment, Component } = wp.element;
const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;

class Archive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      kind: false,
      slug: false,
      page: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const page = props.match.search || 1;
    const kind =
      (props.match.category && 'category') ||
      (props.match.tag && 'tag') ||
      (props.match.search && 'search');
    const slug = props.match[kind];
    const entities =
      props.getArchive(kind, slug, page).archive &&
      props.getArchive(kind, slug, page).archive.entities;

    if (!slug || state.slug === slug || entities) {
      return { kind, slug, page };
    }

    props.requestArchive(kind, slug, page);
    return { kind, slug, page };
  }

  render() {
    if (!this.state.slug) {
      return null;
    }

    const { kind, slug, page } = this.state;
    const { archive, loading } = this.props.getArchive(kind, slug, page);

    if (loading) {
      return (
        <Public className="template-archive">
          <PageHeader>
            <Loading />
          </PageHeader>
        </Public>
      );
    }

    if (IS_ERROR === archive.entities) {
      return (
        <Public className="template-archive">
          <PageHeader>
            <h1>Error Reading Content</h1>
            <p>Please try it again</p>
          </PageHeader>
        </Public>
      );
    }

    return (
      <Public className="template-archive">
        <PageHeader backgroundImage={archive.background}>
          <Fragment>
            <h1>{archive.title}</h1>
            <p>{archive.description}</p>
          </Fragment>
        </PageHeader>

        <section className="row post-grid">
          {archive.entities.map(item => {
            const date = parseDate(item.date);
            const title = decodeURIComponent(getRenderedText(item.title));
            const excerpt = decodeURIComponent(getRenderedText(item.excerpt));
            const image = parseJson(item.meta.list, 'post-thumbnail');

            return (
              <div
                className="columns large-4 medium-6 small-12"
                key={`${kind}-${slug}-${page}-${item.id}`}
              >
                <figure className="thumbnail" itemType="http://schema.org/ImageObject">
                  <Link to={item.link} rel="noopener noreferrer" title={title}>
                    <div className="zoom-icon" />
                    {/* ?? */}
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
          })}
        </section>
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  getArchive: (kind, slug, page) => select(STORE).getArchive(kind, slug, page),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestArchive: (kind, slug, page) => {
    dispatch(STORE).requestArchiveInit(kind, slug, page);

    axios.get(`/wp-json/sujin/v1/posts/${kind}/${slug}/page/${page}?per_page=12`)
      .then((response) => {
        dispatch(STORE).requestArchiveSuccess(page, kind, slug, response);
        // TODO Register a Post
      }).catch(() => {
        dispatch(STORE).requestArchiveFail(page, kind, slug);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Archive);
