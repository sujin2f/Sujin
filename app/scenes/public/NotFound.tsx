import TitleController from 'app/types/title';

import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';
import { isMobile } from 'app/utils/common';

import DEFAULT_BACKGROUND from '../../../assets/images/background/404.jpg';
import DEFAULT_BACKGROUND_MOBILE from '../../../assets/images/background/404-mobile.jpg';

const { Component } = wp.element;

export default class NotFound extends Component {
  render(): JSX.Element {
    TitleController.getInstance().setTitle('Not Found');

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
