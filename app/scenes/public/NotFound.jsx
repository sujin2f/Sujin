import { STORE } from 'app/constants/common';
import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';
import { isMobile } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/404.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/404-mobile.jpg';

const { Component } = wp.element;
const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;

class NotFound extends Component {
  render() {
    if (this.props.title !== 'Not Found') {
      this.props.setTitle('Not Found');
    }

    return (
      <Public className="stretched-background hide-footer template-404">
        <PageHeader backgroundImage={isMobile() ? DEFAULT_BACKGROUND : DEFAULT_BACKGROUND_MOBILE}>
          <h1>SUJIN</h1>
          <p>Not Found</p>
        </PageHeader>
      </Public>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  title: select(STORE).getTitle(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  setTitle: (title) => {
    dispatch(STORE).setTitle(title);
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(NotFound);
