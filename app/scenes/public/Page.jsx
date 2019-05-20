import axios from 'axios';

import PageHeader from 'app/components/layout/PageHeader';
import { STORE, IS_LOADING, IS_ERROR } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Fragment, Component } = wp.element;

class Page extends Component {
  static getDerivedStateFromProps(props) {
    const {
      history,
      requestPage,
      getPage,
    } = props;

    const slug = history.location.pathname.split('/').filter(v => v).pop();
    const page = getPage(slug);

    if (IS_LOADING === page) {
      return;
    }

    if (IS_ERROR === page) {
      return;
    }

    if (!page) {
      requestPage(slug);
    }
  }

  render() {
    return (
      <section className="page-wrapper">
        <PageHeader
          backgroundImage=""
        >
          <Fragment>
            <h1>SUJIN</h1>
            <p>Wordpress/React Developer</p>
          </Fragment>
        </PageHeader>

        Page
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
