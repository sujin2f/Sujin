import axios from 'axios';

import Post from 'app/types/rest/post';
import ReactComponent from 'app/types/component';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import NotFound from 'app/scenes/public/NotFound';

import { STORE } from 'app/constants/common';

import { parseExImage } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/category-mobile.jpg';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  // select
  getPage(slug: string): Post | boolean | undefined;
  matched: any;
  title: string;
  // props
  requestPage(slug: string): void;
  setTitle(title: string): void;
};

interface State {
  slug: string;
};

class Page extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { slug: '' };

    this.getLoading = this.getLoading.bind(this);
    this.getNotFound = this.getNotFound.bind(this);
    this.setTitle = this.setTitle.bind(this);
  }

  static getDerivedStateFromProps(props: Props, state: State): State {
    const slug = props.matched.slug;

    if (!slug || state.slug === slug || typeof props.getPage(slug) !== 'undefined') {
      return { slug };
    }

    props.requestPage(slug);
    return { slug };
  }

  getLoading(): ReactComponent {
    const page = this.props.getPage(this.state.slug);

    if (page === true) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    return null;
  }

  getNotFound(): ReactComponent {
    const page = this.props.getPage(this.state.slug);

    if (page === false) {
      return (<NotFound />);
    }

    return null;
  }

  setTitle(): void {
    const page = this.props.getPage(this.state.slug);
    const { title, setTitle } = this.props;

    if (title !== page.title) {
      setTitle(page.title);
    }
  }

  render(): ReactComponent {
    if (!this.state.slug) {
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

    this.setTitle();

    const page = this.props.getPage(this.state.slug);

    const backgroundImage: string =
      parseExImage(
        page.meta.background,
        page.thumbnail,
        'medium_large',
        'post-thumbnail',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND_MOBILE,
      );

    return (
      <Public className="template-single">
        <PageHeader
          backgroundImage={backgroundImage}
          title={page.title}
          description={page.excerpt}
        />

        <section className="row">
          <Content post={page} className="medium-12" />
        </section>
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  getPage: (slug: string) => select(STORE).getPage(slug),
  matched: select(STORE).getMatched(),
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestPage: (slug: string): void => {
    dispatch(STORE).requestPageInit(slug);

    axios.get(`/wp-json/sujin/v1/posts/?slug=${slug}`)
      .then((response) => {
        const page = new Post(response.data);
        dispatch(STORE).requestPageSuccess(page);
      }).catch((error) => {
        dispatch(STORE).requestPageFail(slug);
      });
  },
  setTitle: (title: string): void => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Page);
