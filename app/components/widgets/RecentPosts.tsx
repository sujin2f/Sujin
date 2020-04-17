/** app/components/widgets/RecentPosts */

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
        items,
      },
    } = archive;

    return (
      <section className="widget recent-posts with-border row">
        {items.map((item: ISimplePost) => (
          <Item
            key={`recent-post-id-${item.slug}`}
            columns="large-12 medium-6 small-6"
            item={item}
            thumbnailKey={{ desktop: 'small', mobile: 'small' }}
          />
        ))}
      </section>
    );
  }
}

export default compose([])(RecentPosts);
