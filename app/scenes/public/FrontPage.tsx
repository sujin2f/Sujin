import BackgroundController from 'app/controllers/rest/background';
import GlobalController from 'app/controllers/global';

import PageHeader from 'app/components/layout/PageHeader';
import Public from 'app/scenes/public';
import DEFAULT_TITLE from 'app/constants/common';

const { Component } = wp.element;
const { compose } = wp.compose;

class FrontPage extends Component {
  componentDidMount(): void {
    BackgroundController.getInstance().request(this);
  }

  render(): JSX.Element {
    GlobalController.getInstance().setTitle(DEFAULT_TITLE);

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

export default compose([])(FrontPage);
