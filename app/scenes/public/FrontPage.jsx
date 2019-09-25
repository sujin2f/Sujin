import axios from 'axios';
import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';
import { STORE, DEFAULT_TITLE } from 'app/constants/common';
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
    const {
      mainBackground: {
        entities,
        error,
      },
    } = this.props;

    if (entities.length > 0 && error === false) {
      return;
    }

    this.props.requestMainBackground();
  }

  parseBackground() {
    const {
      mainBackground: {
        entities,
        loading,
        error,
      },
    } = this.props;

    if (error) {
      return DEFAULT_BACKGROUND;
    }

    if (loading || entities.length === 0) {
      return null;
    }

    const index = Math.floor(Math.random() * entities.length);
    return isMobile() ? entities[index].mobile : entities[index].desktop;
  }

  render() {
    if (this.props.title !== DEFAULT_TITLE) {
      this.props.setTitle(DEFAULT_TITLE);
    }

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
  title: select(STORE).getTitle(),
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
  setTitle: (title) => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(FrontPage);
