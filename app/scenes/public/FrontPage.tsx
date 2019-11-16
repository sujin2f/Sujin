/** app/scenes/public/FrontPage */

import { WithController } from 'app/scenes/WithController';

// Controllers
import { IRestController } from 'app/controllers/rest';
import BackgroundController from 'app/controllers/rest/background';

// Components
import PageHeader from 'app/components/layout/PageHeader';
import Post from 'app/scenes/public/Post';
import Page from 'app/scenes/public/Page';
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

    if (sujin.frontPage === 'front-page') {
      const backgroundImage = this.getController().getBackgroundImage();
      this.setTitle(sujin.title);

      return (
        <Public className="stretched-background hide-footer">
          <PageHeader
            backgroundImage={backgroundImage}
            title={sujin.title.toUpperCase()}
            description={sujin.description}
          />
        </Public>
      );
    }

    this.setTitle(DEFAULT_TITLE);

    if (sujin.showOnFront === 'posts') {
      return (
        <Post
          hideFrontFooter={sujin.hideFrontFooter}
          hideFrontHeader={sujin.hideFrontHeader}
          frontPage={sujin.frontPage}
        />
      );
    }

    if (sujin.showOnFront === 'page') {
      return (
        <Page
          hideFrontFooter={sujin.hideFrontFooter}
          hideFrontHeader={sujin.hideFrontHeader}
          frontPage={sujin.frontPage}
        />
      );
    }

    return null;
  }
}

export default compose([])(FrontPage);
