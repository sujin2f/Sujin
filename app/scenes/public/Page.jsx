import axios from 'axios';

import PageHeader from 'app/components/layout/PageHeader';
import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Fragment, Component } = wp.element;

class Page extends Component {
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
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestPage: (slug) => {
    axios.get(`/wp-json/wp/v2/pages/${slug}`)
      .then((response) => {
        dispatch(STORE).requestPageSuccess(response);
      }).catch((error) => {
        dispatch(STORE).requestPageFail(error);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Page);
