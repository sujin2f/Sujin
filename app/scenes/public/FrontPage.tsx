import BackgroundController from 'app/controllers/rest/background';
import GlobalController from 'app/controllers/global';

import PageHeader from 'app/components/layout/PageHeader';
import Post from 'app/scenes/public/Post';
import Page from 'app/scenes/public/Page';
import Public from 'app/scenes/public';

const { Component } = wp.element;
const { compose } = wp.compose;

class FrontPage extends Component {
  render(): JSX.Element {
    if (sujin.frontPage === 'front-page') {
      const backgroundImage = BackgroundController.getInstance().addComponent(this).request().getBackgroundImage();
      GlobalController.getInstance().setTitle(sujin.title);

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
