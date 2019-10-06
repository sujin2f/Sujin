import GlobalState from './global';
import PostState from './post';
import { PostObject } from 'app/types/responses/post';

export default interface State {
  global: GlobalState;
  page: PostObject;
  post: PostState;
}
