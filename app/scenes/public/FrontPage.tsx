/** app/scenes/public/FrontPage */

import { WithController } from 'app/scenes/WithController';

// Controllers
import { IRestController } from 'app/controllers/rest';
import BackgroundController from 'app/controllers/rest/background';

// JSX
import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';

// Constant
import { DEFAULT_TITLE } from 'app/constants/common';

// Wordpress
const { compose } = wp.compose;

class FrontPage extends WithController {
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
