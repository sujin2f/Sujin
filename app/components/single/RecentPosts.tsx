/** app/components/single/RecentPosts */

import { WithController } from 'app/scenes/WithController';

// Controller
import { IRestController } from 'app/controllers/rest';
import RecentPostController from 'app/controllers/rest/recent-post';

// Item
import { ISimplePost } from 'app/items/rest/interface/simple-post';

// Components
import Item from 'app/components/archive/Item';

// Wordpress
const { Fragment } = wp.element;
const { compose } = wp.compose;

class RecentPosts extends WithController {
  public getController(): IRestController {
    return RecentPostController.getInstance().addComponent(this);
  }

  render(): JSX.Element {
    this.request();
    const isPending = this.isPending();

    if (isPending) {
      return (<Fragment />);
    }

    const archive = this.getController();
    const {
      entity: {
        id,
        items,
      },
    } = archive;

    return (
      <Fragment>
        <header>
          <h2 className="section-header"><span>Recent Posts</span></h2>
        </header>

        {items.map((item: ISimplePost) => (
          <Item
            key={`recent-post-id-${id}`}
            columns="large-12 medium-12 small-12"
            item={item}
            thumbnailKey={{ desktop: 'small', mobile: 'small' }}
          />
        ))}
      </Fragment>
    );
  }
}

export default compose([])(RecentPosts);
