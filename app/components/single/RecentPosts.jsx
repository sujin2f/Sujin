import axios from 'axios';

import Loading from 'app/components/layout/Loading';
import Item from 'app/components/archive/Item';

import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Fragment, Component } = wp.element;

class RecentPosts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const {
      requestRecentPosts,
    } = this.props;

    if (!this.state.loaded) {
      requestRecentPosts();
      this.setState({ loaded: true });
    }
  }

  render() {
    const { getRecentPosts } = this.props;
    const { entities, loading } = getRecentPosts();

    console.log(entities);

    return (
      <Fragment>
        {loading &&
          <Loading />
        }
        {!loading && entities && entities.map(entity => (
          <Item
            key={`recent-post-id-${entity.id}`}
            id={`post-id-${entity.id}`}
            columns="large-12 medium-12 small-12"
            item={entity}
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
        dispatch(STORE).requestRecentPostsSuccess(response);
      }).catch(() => {
        dispatch(STORE).requestRecentPostsFail();
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(RecentPosts);
