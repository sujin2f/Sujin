import axios from 'axios';

import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/Public';

import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Fragment, Component } = wp.element;

class FrontPage extends Component {
  componentDidMount() {
    const {
      requestMainBackground,
      mainBackground,
    } = this.props;

    if (Object.keys(mainBackground).length === 0) {
      requestMainBackground();
    }
  }

  render() {
    const { mainBackground } = this.props;

    const backgroundImage =
      Object.keys(mainBackground).length === 0 ?
        false :
        mainBackground.large;

    return (
      <Public className="stretched-background hide-footer">
        <PageHeader backgroundImage={backgroundImage}>
          <Fragment>
            <h1>SUJIN</h1>
            <p>Wordpress/React Developer</p>
          </Fragment>
        </PageHeader>
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  mainBackground: select(STORE).getMainBackground(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestMainBackground: () => {
    axios.get('/wp-json/sujin/v1/media/random')
      .then((response) => {
        dispatch(STORE).requestMainBackgroundSuccess(response);
      }).catch((error) => {
        dispatch(STORE).requestMainBackgroundFail(error);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(FrontPage);
