import axios from 'axios';

import Public from 'app/scenes/Public';
import PageHeader from 'app/components/layout/PageHeader';
import Loading from 'app/components/layout/Loading';
import Item from 'app/components/archive/Item';
import Paging from 'app/components/archive/Paging';
import NotFound from 'app/scenes/Public/NotFound';

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
    const page = props.matched.page || 1;
    const kind =
      (props.matched.category && 'category') ||
      (props.matched.tag && 'tag') ||
      (props.matched.search && 'search');
    const slug = props.matched[kind];
    const entities =
      props.getArchive(kind, slug, page).archive &&
      props.getArchive(kind, slug, page).archive.entities;

    if (state.kind === kind && state.slug === slug && state.page === page) {
      return { kind, slug, page };
    }

    if (!slug || entities) {
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
    const {
      archive,
      loading,
      totalPages,
      background,
      title,
      description,
    } = this.props.getArchive(kind, slug, page);

    if (loading || !archive) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader>
            <Loading />
          </PageHeader>
        </Public>
      );
    }

    if (IS_ERROR === archive.entities) {
      return (
        <NotFound />
      );
    }

    return (
      <Public className="template-archive">
        <PageHeader backgroundImage={background}>
          <Fragment>
            <h1>{title}</h1>
            <p>{description}</p>
          </Fragment>
        </PageHeader>

        <section className="row post-grid">
          {archive.entities.map(item => (
            <Item item={item} key={`${kind}-${slug}-${page}-${item.id}`} />
          ))}
        </section>

        <Paging
          totalPages={totalPages}
          currentPage={page}
          urlPrefix={`/${kind}/${slug}`}
        />
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  getArchive: (kind, slug, page) => select(STORE).getArchive(kind, slug, page),
  matched: select(STORE).getMatched(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestArchive: (kind, slug, page) => {
    dispatch(STORE).requestArchiveInit(kind, slug, page);

    axios.get(`/wp-json/sujin/v1/posts/${kind}/${slug}/page/${page}?per_page=12`)
      .then((response) => {
        dispatch(STORE).requestArchiveSuccess(page, kind, slug, response);
        // Register each Post
        response.data.map(value => dispatch(STORE).requestPostSuccess(value.slug, { data: value }));
      }).catch(() => {
        dispatch(STORE).requestArchiveFail(page, kind, slug);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Archive);
