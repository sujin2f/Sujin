import GlobalState from './global';
import PostState from './post';
import { PostObject } from 'app/types/rest/post';

export default interface State {
  global: GlobalState;
  page: PostObject;
  post: PostState;
}
