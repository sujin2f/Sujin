import { PostObject } from 'app/types/responses/post';
import PageActions from 'app/types/actions/page';

import {
  REQUEST_PAGE_INIT,
  REQUEST_PAGE_SUCCESS,
  REQUEST_PAGE_FAIL,
} from 'app/constants/redux';

const initialState: PostObject = {};

function page(state: PostObject = initialState, action: PageActions) {
  switch (action.type) {
    case REQUEST_PAGE_INIT: {
      return {
        ...state,
        [action.slug]: true,
      };
    }

    case REQUEST_PAGE_SUCCESS: {
      return {
        ...state,
        [action.page.slug]: action.page,
      };
    }

    case REQUEST_PAGE_FAIL: {
      return {
        ...state,
        [action.slug]: false,
      };
    }

    default: {
      return state;
    }
  }
}

export default page;
