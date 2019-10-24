import GlobalController from 'app/controllers/global';

import Public from 'app/scenes/public';

import PageHeader from 'app/components/layout/PageHeader';
import { isMobile } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/404.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/404-mobile.jpg';

const { Component } = wp.element;
const { compose } = wp.compose;

class NotFound extends Component {
  render(): JSX.Element {
    GlobalController.getInstance().setTitle('Not Found');

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

export default compose([])(NotFound);
