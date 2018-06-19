import {
  GET_PAGE_INIT,
  GET_PAGE_SUCCESS,
  GET_PAGE_FAIL,
} from 'app/actions/page';

const initialState = {
  loading: true,
};

function page(state = initialState, action) {
  switch (action.type) {
    case GET_PAGE_INIT: {
      return {
        loading: true,
      };
    }

    case GET_PAGE_SUCCESS: {
      return {
        ...action.response.data[0],
        loading: false,
      };
    }

    case GET_PAGE_FAIL: {
      return {
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export default page;
