import axios from 'axios';

import PageHeader from 'app/components/layout/PageHeader';
import Content from 'app/components/single/Content';
import Loading from 'app/components/layout/Loading';
import { STORE, IS_ERROR } from 'app/constants/common';

import { getRenderedText } from 'app/utils/global';

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
    const slug = props.history.location.pathname
      .split('/')
      .filter(v => v)
      .pop();

    if (state.slug === slug || props.getPage(slug).page) {
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
        <section className="page-wrapper">
          <PageHeader>
            <Loading />
          </PageHeader>
        </section>
      );
    }

    if (IS_ERROR === page) {
      return (
        <section className="page-wrapper">
          <PageHeader>
            <h1>Error Reading Content</h1>
            <p>Please try it again</p>
          </PageHeader>
        </section>
      );
    }

    return (
      <section className="page-wrapper">
        <PageHeader backgroundImage="">
          <Fragment>
            <h1>{getRenderedText(page.title)}</h1>
            <p>{getRenderedText(page.excerpt)}</p>
          </Fragment>
        </PageHeader>

        <Content post={page} />
      </section>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  getPage: (slug) => select(STORE).getPage(slug),
  history: select(STORE).getHistory(),
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
