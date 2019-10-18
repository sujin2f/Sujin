import BackgroundController from 'app/types/rest/background';
import TitleController from 'app/types/title';

import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';
import { DEFAULT_TITLE } from 'app/constants/common';

const { Component } = wp.element;

export default class FrontPage extends Component {
  componentDidMount(): void {
    console.log('FrontPage.componentDidMount');
    const bg = BackgroundController.getInstance();
    if (!bg.isInit()) {
      bg.request(this);
    }
  }

  render(): JSX.Element {
    TitleController.getInstance().setTitle(DEFAULT_TITLE);

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
