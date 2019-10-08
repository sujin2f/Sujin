import axios from 'axios';

import Post from 'app/types/rest/post';
import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Item from 'app/components/archive/Item';
import Paging from 'app/components/archive/Paging';
import NotFound from 'app/scenes/public/NotFound';

import { STORE } from 'app/constants/common';
import { isMobile } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

const { Fragment, Component } = wp.element;
const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;

interface Props {
  // select
  getArchive(arg: any): any;
  matched: any;
  title: any;
  // props
  requestArchive(arg: any): void;
  setTitle(title: string): void;
};

interface State {
  kind: string;
  slug: string;
  page: number;
  title: string;
};

class Archive extends Component<Props, State> {
  static shouldRequest(props: Props, state: State) {
    const { kind, slug, page } = Archive.parseMatched(props.matched);

    if (!slug) {
      return false;
    }

    // If not changed
    if (state.kind === kind && state.slug === slug && state.page === page) {
      return false;
    }

    if (typeof props.getArchive({ kind, slug, page }).archive !== 'undefined') {
      return false;
    }

    return { kind, slug, page };
  }

  static parseMatched(matched) {
    const page = parseInt((matched && matched.page) || 1, 10);
    const kind =
      (matched.category && 'category') ||
      (matched.tag && 'tag') ||
      (matched.search && 'search');
    const slug = matched[kind];

    return { kind, slug, page };
  }

  static setTitle(props: Props, state: State, requestParams) {
    const title = props.getArchive(requestParams).title;
    if (title !== state.title) {
      props.setTitle(`Archive: ${title}`);
    }

    return title;
  }

  constructor(props: Props) {
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
    const archive = this.props.getArchive(this.state).archive;

    if (archive === true) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    return null;
  }

  getNotFound() {
    const archive = this.props.getArchive(this.state).archive;

    if (archive === false) {
      return (<NotFound />);
    }

    return null;
  }

  static getDerivedStateFromProps(props: Props, state: State) {
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

    const loading = this.getLoading();
    if (loading) {
      return loading;
    }

    const notFound = this.getNotFound();
    if (notFound) {
      return notFound;
    }

    const {
      archive,
      totalPages,
      background,
      description,
      title,
    } = this.props.getArchive(this.state);
    const defaultBackground = isMobile() ? DEFAULT_BACKGROUND_MOBILE : DEFAULT_BACKGROUND;
    const backgroundImage = background || defaultBackground;

    return (
      <Public className="template-archive">

        <PageHeader
          backgroundImage={backgroundImage}
          prefix={kind}
          title={title}
          description={description.replace(/\+/g, ' ')}
        />

        {archive && archive.length > 0 && (
          <Fragment>
            <section className="row post-grid">
              {archive.map(item => (
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
    dispatch(STORE).requestArchiveInit(page, kind, slug);

    axios.get(`/wp-json/sujin/v1/posts/?list_type=${kind}&keyword=${slug}&page=${page}&per_page=12`)
      .then((response) => {
        const posts = response.data.map((post) => new Post(post));
        dispatch(STORE).requestArchiveSuccess(page, kind, slug, response.headers, posts);
      }).catch((error) => {
        dispatch(STORE).requestArchiveFail(page, kind, slug);
      });
  },
  setTitle: (title) => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Archive);
