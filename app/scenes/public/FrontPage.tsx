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

// Wordpress
const { compose } = wp.compose;

/*
 * For React components which uses Controller
 */
class FrontPage extends WithController {
  getController(): IRestController {
    return BackgroundController.getInstance().addComponent(this);
  }

  render(): JSX.Element {
    const {
      title,
      description,
      frontPage,
      hideFrontFooter,
      hideFrontHeader,
      showOnFront,
    } = sujin;

    this.request();
    this.setTitle(title);

    if (frontPage === 'front-page') {
      const backgroundImage = this.getController().getBackgroundImage();

      return (
        <Public className="stretched-background hide-footer">
          <PageHeader
            backgroundImage={backgroundImage}
            title={title.toUpperCase()}
            description={description}
          />
        </Public>
      );
    }

    if (showOnFront === 'posts') {
      return (
        <Post
          hideFrontFooter={hideFrontFooter}
          hideFrontHeader={hideFrontHeader}
          frontPage={frontPage}
        />
      );
    }

    if (showOnFront === 'page') {
      return (
        <Page
          hideFrontFooter={hideFrontFooter}
          hideFrontHeader={hideFrontHeader}
          frontPage={frontPage}
        />
      );
    }

    return null;
  }
}

export default compose([])(FrontPage);
