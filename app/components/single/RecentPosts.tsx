import axios from 'axios';

import Post from 'app/types/responses/post';
import Loading from 'app/components/layout/Loading';
import Item from 'app/components/archive/Item';

import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component, Fragment } = wp.element;

class RecentPosts extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
  }

  componentDidMount() {
    const {
      getRecentPosts,
      requestRecentPosts,
    } = this.props;

    if (typeof getRecentPosts() !== 'undefined') {
      return;
    }

    if (!this.state.loaded) {
      requestRecentPosts();
      this.setState({ loaded: true });
    }
  }

  render() {
    const { getRecentPosts } = this.props;
    const posts = this.props.getRecentPosts();

    if (posts === true) {
      return (<Loading />);
    }

    if (!posts) {
      return null;
    }

    return (
      <Fragment>
        <header>
          <h2 className="section-header"><span>Recent Posts</span></h2>
        </header>

        {posts.map(entity => (
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

const mapStateToProps = withSelect((select) => ({
  getRecentPosts: () => select(STORE).getRecentPosts(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestRecentPosts: () => {
    dispatch(STORE).requestRecentPostsInit();

    axios.get('/wp-json/sujin/v1/posts/?per_page=4')
      .then((response) => {
        const posts = response.data.map((post) => new Post(post));
        dispatch(STORE).requestRecentPostsSuccess(posts);
      }).catch(() => {
        dispatch(STORE).requestRecentPostsFail();
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(RecentPosts);
