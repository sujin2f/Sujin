import axios from 'axios';

import PageHeader from 'app/components/layout/PageHeader';

import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Fragment, Component } = wp.element;

class FrontPage extends Component {
  componentDidMount() {
    const {
      mainBackground,
      getMainBackground,
    } = this.props;

    if (Object.keys(mainBackground).length === 0) {
      getMainBackground();
    }
  }

  render() {
    const { mainBackground } = this.props;

    const backgroundImage =
      Object.keys(mainBackground).length === 0 ?
        '' :
        `url(${mainBackground.large})`;

    return (
      <PageHeader backgroundImage={backgroundImage}>
        <Fragment>
          <h1>SUJIN</h1>
          <p>Wordpress/React Developer</p>
        </Fragment>
      </PageHeader>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  mainBackground: select(STORE).getMainBackground(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  getMainBackground: () => {
    axios.get('/wp-json/sujin/v1/media/random')
      .then((response) => {
        dispatch(STORE).getMainBackgroundSuccess(response);
      }).catch((error) => {
        dispatch(STORE).getMainBackgroundFail(error);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(FrontPage);
