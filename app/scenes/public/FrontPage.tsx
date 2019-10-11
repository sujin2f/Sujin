import BackgroundController from 'app/types/rest/background';

import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';
import { STORE } from 'app/constants/common';
import { DEFAULT_TITLE } from 'app/constants/common';

const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  // select
  title: string;
  // props
  setTitle(title: string): void;
};

class FrontPage extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    const bg = BackgroundController.getInstance();
    if (!bg.isInit()) {
      bg.request(this);
    }
  }

  render() {
    if (this.props.title !== DEFAULT_TITLE) {
      this.props.setTitle(DEFAULT_TITLE);
    }

    return (
      <Public className="stretched-background hide-footer">
        <PageHeader
          backgroundImage={BackgroundController.getInstance().getBackgroundImage()}
          title="SUJIN"
          description="<p>Wordpress/React Developer</p>"
        />
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  setTitle: (title: string): void => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(FrontPage);
