import axios from 'axios';

import Public from 'app/scenes/Public';
import PageHeader from 'app/components/layout/PageHeader';
import Loading from 'app/components/layout/Loading';
import { STORE, IS_ERROR } from 'app/constants/common';

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
      category,
      loading,
    } = this.props.getArchive(kind, slug, page);

    console.log(this.props.match);
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

    if (IS_ERROR === category) {
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

          Archive
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
