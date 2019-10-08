import axios from 'axios';

import { MainBackgroundArray } from 'app/types/rest/main-background';

import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';

import { STORE, DEFAULT_TITLE } from 'app/constants/common';
import { isMobile } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/backup-background.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/backup-background-mobile.jpg';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  // select
  background: MainBackgroundArray;
  title: string;
  // props
  requestMainBackground(): void;
  setTitle(title: string): void;
};

class FrontPage extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.requestMainBackground = this.requestMainBackground.bind(this);
    this.parseBackground = this.parseBackground.bind(this);
  }

  componentDidMount() {
    this.requestMainBackground();
  }

  requestMainBackground(): void {
    const { background } = this.props;

    if (typeof background !== 'undefined') {
      return null;
    }

    this.props.requestMainBackground();
  }

  parseBackground(): string {
    const { background } = this.props;

    if (false === background) {
      if (isMobile()) {
        return DEFAULT_BACKGROUND_MOBILE;
      }
      return DEFAULT_BACKGROUND;
    }

    if (typeof background !== 'object' || background.length === 0) {
      return '';
    }

    const index = Math.floor(Math.random() * background.length);
    return isMobile() ? background[index].mobile : background[index].desktop;
  }

  render() {
    if (this.props.title !== DEFAULT_TITLE) {
      this.props.setTitle(DEFAULT_TITLE);
    }

    return (
      <Public className="stretched-background hide-footer">
        <PageHeader
          backgroundImage={this.parseBackground()}
          title="SUJIN"
          description="<p>Wordpress/React Developer</p>"
        />
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  background: select(STORE).getMainBackground(),
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestMainBackground: (): void => {
    axios.get('/wp-json/sujin/v1/media/random')
      .then((response) => {
        if (response.status === 204) {
          dispatch(STORE).requestMainBackgroundFail();
          return;
        }

        dispatch(STORE).requestMainBackgroundSuccess(response.data);
      }).catch(() => {
        dispatch(STORE).requestMainBackgroundFail();
      });
  },
  setTitle: (title: string): void => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(FrontPage);
