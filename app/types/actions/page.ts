import Post from 'app/types/responses/post';
import {
  REQUEST_PAGE_INIT,
  REQUEST_PAGE_SUCCESS,
  REQUEST_PAGE_FAIL,
} from 'app/constants/redux';

export interface RequestPageInit {
  type: REQUEST_PAGE_INIT;
  slug: string;
}

export interface RequestPageSuccess {
  type: REQUEST_PAGE_SUCCESS;
  page: Post;
}

export interface RequestPageFail {
  type: REQUEST_PAGE_FAIL;
  slug: string;
}

type PageActions = RequestPageInit | RequestPageSuccess | RequestPageFail;
export default PageActions;
