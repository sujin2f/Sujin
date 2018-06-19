import {
  GET_POSTS_INIT,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAIL,
} from 'app/actions/archive';

const initialState = {
  entities: [],
  cancelToken: null,
  loading: true,
  totalPage: 0,
  numPosts: 0,
  paging: [],
  label: null,
  title: '',
  description: '',
  background: null,
};

function archive(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS_INIT: {
      return {
        ...state,
        loading: true,
        entities: [],
        cancelToken: null,
        totalPage: 0,
        numPosts: 0,
        paging: [],
        label: null,
        title: '',
        description: '',
        background: null,
      };
    }

    case GET_POSTS_SUCCESS: {
      let label = 'category';
      let title = decodeURIComponent(action.response.headers['x-wp-term-name']);
      let description = decodeURIComponent(action.response.headers['x-wp-term-description']);

      if (action.response.config.params.tag_names) {
        label = 'tag';
      } else if (action.response.config.params.search) {
        label = 'search';
        title = action.response.config.params.search;
        description = '';
      }

      return {
        ...state,
        entities: action.response.data,
        totalPage: parseInt(action.response.headers['x-wp-totalpages'], 10),
        numPosts: parseInt(action.response.headers['x-wp-total'], 10),
        loading: false,
        label,
        title,
        description,
        background: action.response.headers['x-wp-term-thumbnail'],
      };
    }

    case GET_POSTS_FAIL: {
      return {
        ...state,
        loading: true,
        entities: [],
        cancelToken: null,
        totalPage: 0,
        numPosts: 0,
        paging: [],
        label: null,
        title: '',
        description: '',
        background: null,
      };
    }

    default: {
      return state;
    }
  }
}

export default archive;
