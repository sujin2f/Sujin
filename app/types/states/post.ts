import Post from 'app/types/rest/post';

export default interface PostState {
  recent: Array<Post> | boolean | undefined; // true is loading, false is failed, undefined is not yet loaded
};
