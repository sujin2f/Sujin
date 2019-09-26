import axios from 'axios';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Item from 'app/components/archive/Item';
import Paging from 'app/components/archive/Paging';
import NotFound from 'app/scenes/public/NotFound';

import { STORE } from 'app/constants/common';
import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';

const { Fragment, Component } = wp.element;
const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;

class Archive extends Component {
  static shouldRequest(props, state) {
    const { kind, slug, page } = Archive.parseMatched(props.matched);

    if (!slug) {
      return false;
    }

    // If not changed
    if (state.kind === kind && state.slug === slug && state.page === page) {
      return false;
    }

    const archive = props.getArchive({ kind, slug, page }).archive;

    if (archive && archive.entities) {
      return false;
    }

    return { kind, slug, page };
  }

  static parseMatched(matched) {
    const page = (matched && matched.page) || 1;
    const kind =
      (matched.category && 'category') ||
      (matched.tag && 'tag') ||
      (matched.search && 'search');
    const slug = matched[kind];

    return { kind, slug, page };
  }

  static setTitle(props, state, requestParams) {
    const { title } = props.getArchive(requestParams);
    if (title !== state.title) {
      props.setTitle(`Archive: ${title}`);
    }

    return title;
  }

  constructor(props) {
    super(props);

    this.state = {
      kind: null,
      slug: null,
      page: null,
      title: undefined,
    };

    this.getLoading = this.getLoading.bind(this);
    this.getNotFound = this.getNotFound.bind(this);
  }

  getLoading() {
    const { archive, loading } = this.props.getArchive(this.state);

    if (loading || !archive) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    return null;
  }

  getNotFound() {
    const { archive } = this.props.getArchive(this.state);

    if (archive === 'NOT_FOUND') {
      return (<NotFound />);
    }

    return null;
  }

  static getDerivedStateFromProps(props, state) {
    const shouldRequest = Archive.shouldRequest(props, state);

    if (shouldRequest) {
      props.requestArchive(shouldRequest);
    }

    const requestParams = Archive.parseMatched(props.matched);

    return {
      ...requestParams,
      title: Archive.setTitle(props, state, requestParams),
    };
  }

  render() {
    const { kind, slug, page } = this.state;

    if (!slug) {
      return null;
    }

    const {
      archive,
      totalPages,
      background,
      description,
      title,
    } = this.props.getArchive(this.state);

    const loading = this.getLoading();
    if (loading) {
      return loading;
    }

    const notFound = this.getNotFound();
    if (notFound) {
      return notFound;
    }

    return (
      <Public className="template-archive">
        <PageHeader
          backgroundImage={background || DEFAULT_BACKGROUND}
          prefix={kind}
          title={title}
          description={description.replace(/\+/g, ' ')}
        />

        {archive.entities && archive.entities.length > 0 && (
          <Fragment>
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
          </Fragment>
        )}
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  getArchive: (state) => select(STORE).getArchive(state.kind, state.slug, state.page),
  matched: select(STORE).getMatched(),
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestArchive: ({ kind, slug, page }) => {
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
