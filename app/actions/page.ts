import {
  REQUEST_PAGE_INIT,
  REQUEST_PAGE_SUCCESS,
  REQUEST_PAGE_FAIL,
} from 'app/constants/redux';

import {
  RequestPageInit,
  RequestPageSuccess,
  RequestPageFail,
} from 'app/types/actions/page';

export function requestPageInit(slug: string): RequestPageInit {
  return {
    type: REQUEST_PAGE_INIT,
    slug,
  };
}

export function requestPageSuccess(slug: string, response: any): RequestPageSuccess {
  return {
    type: REQUEST_PAGE_SUCCESS,
    slug,
    response,
  };
}

export function requestPageFail(code: string, slug: string): RequestPageFail {
  return {
    type: REQUEST_PAGE_FAIL,
    code,
    slug,
  };
}
