import ReduxWrapper from 'src/ReduxWrapper';

import { getRelatedPosts } from 'app/actions/related-post';

import RelatedPosts from './RelatedPosts';

const mapStateToProps = state => ({ ...state.relatedPost });

const mapDispatchToProps = dispatch => ({
  getRelatedPosts: (postId, token) => {
    dispatch(getRelatedPosts(postId, token));
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, RelatedPosts);
