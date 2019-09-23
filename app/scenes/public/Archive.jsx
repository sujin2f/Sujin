import axios from 'axios';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Loading from 'app/components/layout/Loading';
import Item from 'app/components/archive/Item';
import Paging from 'app/components/archive/Paging';
import NotFound from 'app/scenes/public/NotFound';

import { STORE } from 'app/constants/common';
import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';

const { Fragment, Component } = wp.element;
const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;

class Archive extends Component {
  static requestArticle(props, state) {
    const page = Archive.getPaged(props);
    const kind = Archive.getKind(props);
    const slug = props.matched[kind];

    if (!slug) {
      return { kind, slug, page };
    }

    // If not changed
    if (state.kind === kind && state.slug === slug && state.page === page) {
      return { kind, slug, page };
    }

    const archive = props.getArchive(kind, slug, page).archive;
    const entities = archive && archive.entities;

    if (entities) {
      return { kind, slug, page };
    }

    props.requestArchive(kind, slug, page);
    return { kind, slug, page };
  }

  static getPaged(props) {
    return (props.matched && props.matched.page) || 1;
  }

  static getKind(props) {
    return (props.matched.category && 'category') ||
      (props.matched.tag && 'tag') ||
      (props.matched.search && 'search');
  }

  static setTitle(props, state, kind, slug, page) {
    const { title } = props.getArchive(kind, slug, page);
    const titleToBe = Archive.getTitle(title);

    if (props.title !== titleToBe && title) {
      props.setTitle(titleToBe);
    }
  }

  static getTitle(title) {
    return `Archive: ${title}`;
  }

  constructor(props) {
    super(props);

    this.state = {
      kind: null,
      slug: null,
      page: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps', props, state);

    const newState = Archive.requestArticle(props, state);
    Archive.setTitle(props, state, newState.kind, newState.slug, newState.page);

    if (state === newState) {
      return null;
    }

    return newState;
  }

  render() {
    console.log('Archive::render');
    const {
      kind,
      slug,
      page,
    } = this.state;

    if (!slug) {
      return null;
    }

    const {
      archive,
      loading,
      totalPages,
      background,
      description,
      title,
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

    if (archive === 'NOT_FOUND') {
      return (
        <NotFound />
      );
    }

    return (
      <Public className="template-archive">
        <PageHeader backgroundImage={background || DEFAULT_BACKGROUND}>
          <Fragment>
            <h1>{title}</h1>
            <p dangerouslySetInnerHTML={{ __html: description.replace(/\+/g, ' ') }} />
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
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestArchive: (kind, slug, page) => {
    dispatch(STORE).requestArchiveInit(kind, slug, page);

    axios.get(`/wp-json/sujin/v1/posts/?list_type=${kind}&keyword=${slug}&page=${page}&per_page=12`)
      .then((response) => {
        dispatch(STORE).requestArchiveSuccess(page, kind, slug, response);
        // Register each Post
        response.data.map(value => dispatch(STORE).requestPostSuccess(value.slug, { data: value }));
      }).catch((error) => {
        dispatch(STORE).requestArchiveFail(error.response.data.code, page, kind, slug);
      });
  },
  setTitle: (title) => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Archive);
