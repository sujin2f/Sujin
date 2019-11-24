import { IRestController } from 'app/controllers/rest/index.d';
import BackgroundController from 'app/controllers/rest/background';
import BaseControllerComponent from 'app/scenes/public/BaseControllerComponent';

import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';

import { DEFAULT_TITLE } from 'app/constants/common';

const { compose } = wp.compose;

class FrontPage extends BaseControllerComponent {
  getController(): IRestController {
    return BackgroundController.getInstance().addComponent(this);
  }

  render(): JSX.Element {
    this.request();
    const backgroundImage = this.getController().getBackgroundImage();
    this.setTitle(DEFAULT_TITLE);

    return (
      <Public className="stretched-background hide-footer">
        <PageHeader
          backgroundImage={backgroundImage}
          title="SUJIN"
          description="<p>Wordpress/React Developer</p>"
        />
      </Public>
    );
  }
}

export default compose([])(FrontPage);
