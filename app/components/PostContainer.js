import ReduxWrapper from 'src/ReduxWrapper';

import { getPost } from 'app/actions/post';
import { resetMobileMenu } from 'app/actions/global';

import Post from './Post';

const mapStateToProps = state => ({
  ...state.post,
  series: state.post.series,
});

const mapDispatchToProps = dispatch => ({
  getPost: (postSlug, push, token) => {
    dispatch(getPost(postSlug, push, token));
  },
  resetMobileMenu: () => {
    dispatch(resetMobileMenu());
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, Post);
