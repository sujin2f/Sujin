import GlobalState from './global';
import PostState from './post';

export default interface State {
  global: GlobalState;
  post: PostState;
}
