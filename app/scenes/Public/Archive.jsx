import axios from 'axios';

import Public from 'app/scenes/Public';
import PageHeader from 'app/components/layout/PageHeader';
import Loading from 'app/components/layout/Loading';
import Link from 'app/components/router/Link';
import { STORE, IS_ERROR } from 'app/constants/common';
import { getRenderedText, getParsedJson } from 'app/utils/global';

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

    if (!slug || state.slug === slug || props.getArchive(kind, slug, page).archive) {
      return { kind, slug, page };
    }

    props.requestArchive(kind, slug, page);
    return { kind, slug, page };
  }

  render() {
    if (!this.state.slug) {
      return null;
    }

    const {
      kind,
      slug,
      page,
    } = this.state;

    const {
      archive,
      loading,
    } = this.props.getArchive(kind, slug, page);

    if (loading) {
      return (
        <Public className="template-archive">
          <section className="page-wrapper">
            <PageHeader>
              <Loading />
            </PageHeader>
          </section>
        </Public>
      );
    }

    if (IS_ERROR === archive) {
      return (
        <Public className="template-archive">
          <section className="page-wrapper">
            <PageHeader>
              <h1>Error Reading Content</h1>
              <p>Please try it again</p>
            </PageHeader>
          </section>
        </Public>
      );
    }

    return (
      <Public className="template-archive">
        <section className="page-wrapper">
          <PageHeader
            backgroundImage=""
          >
            <Fragment>
              <h1>SUJIN</h1>
              <p>Wordpress/React Developer</p>
            </Fragment>
          </PageHeader>

          <section className="row medium-12">
            {archive.map(item => {
              const date = new Date(item.date);
              const day = date.getDate();
              const month = date.toLocaleString('en-us', { month: 'short' });
              const year = date.getFullYear();
              const image = getParsedJson(item.meta.list);

              return (
                <div
                  className="large-4 medium-6 small-12"
                  key={`${kind}-${slug}-${page}-${item.id}`}
                >
                  <figure className="thumbnail" itemType="http://schema.org/ImageObject">
                    <Link
                      to={item.link}
                      rel="noopener noreferrer"
                      title={decodeURIComponent(getRenderedText(item.title))}
                    >
                      <div className="zoom-icon">
                        <i className="fa fa-search" aria-hidden="true" />
                      </div>
                      <div className="inner-shadow" />
                      <time dateTime={item.date}>
                        <span className="day">{day}</span>
                        <span className="month">{month}</span>
                        <span className="year">{year}</span>
                      </time>
                      <div
                        style={{ backgroundImage: `url('${image['post-thumbnail']}')` }}
                        className="attachment-post-thumbnail size-post-thumbnail wp-post-image"
                      />
                    </Link>
                  </figure>
                </div>
              );
            })}
          </section>
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
