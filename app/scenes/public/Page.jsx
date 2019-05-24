import axios from 'axios';

import Public from 'app/scenes/Public';
import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import Loading from 'app/components/layout/Loading';
import { STORE, IS_ERROR } from 'app/constants/common';

import { getRenderedText, parseJson } from 'app/utils/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Fragment, Component } = wp.element;

class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slug: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const slug = props.match.slug;

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
        <Public className="template-single">
          <PageHeader>
            <Loading />
          </PageHeader>
        </Public>
      );
    }

    if (IS_ERROR === page) {
      return (
        <Public className="template-single">
          <PageHeader>
            <h1>Error Reading Content</h1>
            <p>Please try it again</p>
          </PageHeader>
        </Public>
      );
    }

    const backgroundImage = parseJson(page.meta.background);

    return (
      <Public className="template-single">
        <PageHeader backgroundImage={backgroundImage.large}>
          <Fragment>
            <h1>{getRenderedText(page.title)}</h1>
            <p>{getRenderedText(page.excerpt)}</p>
          </Fragment>
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
