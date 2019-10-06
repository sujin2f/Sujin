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
  slug: string;
  response: any;
}

export interface RequestPageFail {
  type: REQUEST_PAGE_FAIL;
  code: string;
  slug: string;
}
