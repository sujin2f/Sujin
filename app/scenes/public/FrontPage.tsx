import BackgroundController from 'app/controllers/rest/background';
import GlobalController from 'app/controllers/global';

import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';

import { DEFAULT_TITLE } from 'app/constants/common';

const { Component } = wp.element;
const { compose } = wp.compose;

class FrontPage extends Component {
  render(): JSX.Element {
    const backgroundImage = BackgroundController.getInstance().addComponent(this).request().getBackgroundImage();
    GlobalController.getInstance().setTitle(DEFAULT_TITLE);

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
