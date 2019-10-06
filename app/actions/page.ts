import Post from 'app/types/responses/post';
import {
  RequestPageInit,
  RequestPageSuccess,
  RequestPageFail,
} from 'app/types/actions/page';

import {
  REQUEST_PAGE_INIT,
  REQUEST_PAGE_SUCCESS,
  REQUEST_PAGE_FAIL,
} from 'app/constants/redux';

export function requestPageInit(slug: string): RequestPageInit {
  return {
    type: REQUEST_PAGE_INIT,
    slug,
  };
}

export function requestPageSuccess(page: Post): RequestPageSuccess {
  return {
    type: REQUEST_PAGE_SUCCESS,
    page,
  };
}

export function requestPageFail(slug: string): RequestPageFail {
  return {
    type: REQUEST_PAGE_FAIL,
    slug,
  };
}
