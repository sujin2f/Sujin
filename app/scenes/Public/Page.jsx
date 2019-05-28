import axios from 'axios';

import Public from 'app/scenes/Public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import Loading from 'app/components/layout/Loading';
import NotFound from 'app/scenes/Public/NotFound';

import { STORE, IS_ERROR } from 'app/constants/common';

import { getRenderedText, parseJson } from 'app/utils/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slug: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const slug = props.matched.slug;

    if (!slug || state.slug === slug || props.getPage(slug).page) {
      return { slug };
    }

    props.requestPage(slug);
    return { slug };
  }

  render() {
    if (!this.state.slug) {
      return null;
    }

    const {
      page,
      loading,
    } = this.props.getPage(this.state.slug);

    if (loading) {
      return (
        <Public className="stretched-background hide-footer">
          <PageHeader>
            <Loading />
          </PageHeader>
        </Public>
      );
    }

    if (IS_ERROR === page) {
      return (
        <NotFound />
      );
    }

    const backgroundImage = parseJson(page.meta.background);

    return (
      <Public className="template-single">
        <PageHeader backgroundImage={backgroundImage.large}>
          <h1>{getRenderedText(page.title)}</h1>
          <p>{getRenderedText(page.excerpt)}</p>
        </PageHeader>

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
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestPage: (slug) => {
    dispatch(STORE).requestPageInit(slug);

    axios.get(`/wp-json/wp/v2/pages/?slug=${slug}`)
      .then((response) => {
        dispatch(STORE).requestPageSuccess(slug, response);
      }).catch(() => {
        dispatch(STORE).requestPageFail(slug);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Page);