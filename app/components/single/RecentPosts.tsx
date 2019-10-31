import RecentPostController from 'app/controllers/rest/recent-post';

import Item from 'app/components/archive/Item';

const { Component, Fragment } = wp.element;
const { compose } = wp.compose;

class RecentPosts extends Component {
  render(): JSX.Element {
    const posts = RecentPostController.getInstance().addComponent(this).request();
    if (!posts.init || posts.loading || posts.failed) {
      return null;
    }

    return (
      <Fragment>
        <header>
          <h2 className="section-header"><span>Recent Posts</span></h2>
        </header>

        {posts.entities.map((entity) => (
          <Item
            key={`recent-post-id-${entity.id}`}
            id={`post-id-${entity.id}`}
            columns="large-12 medium-12 small-12"
            item={entity}
            thumbnail={{ desktop: 'recent-post', mobile: 'recent-post' }}
          />
        ))}
      </Fragment>
    );
  }
}

export default compose([])(RecentPosts);
