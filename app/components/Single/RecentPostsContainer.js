import ReduxWrapper from 'src/ReduxWrapper';

import { getRecentPosts } from 'app/actions/recent-post';

import RecentPosts from './RecentPosts';

const mapStateToProps = state => ({
  ...state.recentPost,
  entities: state.recentPost.entities || [],
});

const mapDispatchToProps = dispatch => ({
  getRecentPosts: (token) => {
    dispatch(getRecentPosts(token));
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, RecentPosts);
