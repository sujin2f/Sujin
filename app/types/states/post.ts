import Post, { PostObject } from 'app/types/rest/post';

export default interface PostState {
  entities: PostObject;
  recent: Array<Post> | boolean | undefined; // true is loading, false is failed, undefined is not yet loaded
};
