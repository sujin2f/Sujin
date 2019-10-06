import GlobalState from './global';
import { PostObject } from 'app/types/responses/post';

export default interface State {
  global: GlobalState;
  page: PostObject;
}
