import axios from 'axios';

import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/Public';

import { STORE, IS_ERROR } from 'app/constants/common';
import { isMobile } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/backup-background.jpg';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class FrontPage extends Component {
  constructor(props) {
    super(props);
    this.requestMainBackground = this.requestMainBackground.bind(this);
    this.parseBackground = this.parseBackground.bind(this);
  }

  componentDidMount() {
    this.requestMainBackground();
  }

  requestMainBackground() {
    if (this.props.mainBackground !== false) {
      return;
    }

    this.props.requestMainBackground();
  }

  parseBackground() {
    const { mainBackground } = this.props;

    const background = mainBackground === IS_ERROR ? DEFAULT_BACKGROUND : false;

    if (typeof mainBackground === 'object') {
      return isMobile() ? mainBackground.large : mainBackground.mediumLarge;
    }

    return background;
  }

  render() {
    return (
      <Public className="stretched-background hide-footer">
        <PageHeader backgroundImage={this.parseBackground()}>
          <h1>SUJIN</h1>
          <p>Wordpress/React Developer</p>
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
