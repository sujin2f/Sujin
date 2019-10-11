// Types
import { RecentPostController } from 'app/types/rest/post';

import Loading from 'app/components/layout/Loading';
import Item from 'app/components/archive/Item';

const { Component, Fragment } = wp.element;

class RecentPosts extends Component {
  componentDidMount() {
    const posts = RecentPostController.getInstance();
    if (!posts.isInit()) {
      posts.request(this);
    }
  }

  render() {
    const posts = RecentPostController.getInstance();

    if (posts.isLoading()) {
      return (<Loading />);
    }

    if (!posts.isInit() || posts.isFailed()) {
      return null;
    }

    return (
      <Fragment>
        <header>
          <h2 className="section-header"><span>Recent Posts</span></h2>
        </header>

        {posts.getItems().map((entity) => (
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

export default RecentPosts;
