import axios from 'axios';

import Public from 'app/scenes/public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import NotFound from 'app/scenes/public/NotFound';

import { STORE } from 'app/constants/common';

import { parseJson } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/category.jpg';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = { slug: false };

    this.getLoading = this.getLoading.bind(this);
    this.getNotFound = this.getNotFound.bind(this);
    this.setTitle = this.setTitle.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const slug = props.matched.slug;

    if (!slug || state.slug === slug || props.getPage(slug).page) {
      return { slug };
    }

    props.requestPage(slug);
    return { slug };
  }

  getLoading() {
    const { loading } = this.props.getPage(this.state.slug);

    if (loading) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader isLoading />
        </Public>
      );
    }

    return null;
  }

  getNotFound() {
    const { page } = this.props.getPage(this.state.slug);

    if (page === 'NOT_FOUND') {
      return (<NotFound />);
    }

    return null;
  }

  setTitle() {
    const { page } = this.props.getPage(this.state.slug);
    const { title, setTitle } = this.props;

    if (title !== page.title) {
      setTitle(page.title);
    }
  }

  render() {
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

    const { page } = this.props.getPage(this.state.slug);

    const backgroundImage =
      parseJson(page.meta.background, 'post-thumbnail') ||
      page.thumbnail ||
      DEFAULT_BACKGROUND;

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
  getPage: (slug) => select(STORE).getPage(slug),
  matched: select(STORE).getMatched(),
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestPage: (slug) => {
    dispatch(STORE).requestPageInit(slug);

    axios.get(`/wp-json/sujin/v1/posts/?slug=${slug}`)
      .then((response) => {
        dispatch(STORE).requestPageSuccess(slug, response);
      }).catch((error) => {
        dispatch(STORE).requestPageFail(error.response.data.code, slug);
      });
  },
  setTitle: (title) => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Page);
