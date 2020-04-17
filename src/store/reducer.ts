import DEFAULT_BACKGROUND from 'assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from 'assets/images/background/category-mobile.jpg';
import { RequestState, TermTypes } from 'constants/enum';
import { CLASS_NAME } from 'constants/dom';
import {
  SET_PUBLIC_CLASS,
  SET_PAGE_HEADER,
  LOAD_MENU_INIT,
  LOAD_MENU_SUCCESS,
  LOAD_POST_INIT,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAIL,
  LOAD_BACKGROUND_INIT,
  LOAD_BACKGROUND_SUCCESS,
  LOAD_BACKGROUND_FAIL,
  LOAD_ARCHIVE_INIT,
  LOAD_ARCHIVE_SUCCESS,
  LOAD_ARCHIVE_FAIL,
} from 'store/actions';
import { IArchive } from 'store/items/interface/archive';
import { IMenu } from 'store/items/interface/menu';
import { IPost } from 'store/items/interface/post';
import { isMobile } from 'utils/common';

interface StateMenu {
  [slug: string]: IMenu|RequestState;
}

interface StatePageHeader {
  background: string;
  backgroundColor: string;
  description: string;
  icon: string;
  isLoading: boolean;
  prefix: string;
  title: string;
  useBackgroundColor: boolean;
}

interface StatePosts {
  [slug: string]: IPost|RequestState;
}

interface StatePublicClass {
  [className: string]: boolean;
}

interface InitialState {
  archive: {
    [termTypes: TermTypes]: {
      [slug: string]: IArchive[];
    };
  };
  background: string;
  menu: StatePublicClass;
  pageHeader: StatePublicClass;
  posts: StatePublicClass;
  publicClass: StatePublicClass;
}

export const initialState: InitialState = {
  // @todo recent post
  archive: {
    ...Object
      .keys(TermTypes)
      .reduce((acc, key) => {
        return {
          ...acc,
          [TermTypes[key]]: {},
        };
      }, {}),
  },
  background: '',
  menu: {},
  pageHeader: {
    background: '',
    backgroundColor: '',
    description: '',
    icon: '',
    isLoading: false,
    prefix: '',
    title: '',
    useBackgroundColor: false,
  },
  posts: {},
  publicClass: {
    layout__wrapper: true,
    ...Object
      .keys(CLASS_NAME.publicScene)
      .reduce((acc, key) => {
        return {
          ...acc,
          [CLASS_NAME.publicScene[key]]: false,
        };
      }, {}),
  },
};

export const reducer = (state = initialState, action: object): InitialState => {
  switch (action.type) {
    case SET_PUBLIC_CLASS:
      return {
        ...state,
        publicClass: {
          ...state.publicClass,
          ...action.publicClass,
        },
      };

    case SET_PAGE_HEADER:
      return {
        ...state,
        pageHeader: {
          ...state.pageHeader,
          ...action.pageHeader,
        },
      };

    case LOAD_MENU_INIT:
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.slug]: RequestState.Loading,
        },
      };

    case LOAD_MENU_SUCCESS:
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.slug]: action.menuItems,
        },
      };

    case LOAD_POST_INIT:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.slug]: RequestState.Loading,
        },
      };

    case LOAD_POST_SUCCESS:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.slug]: action.post,
        },
      };

    case LOAD_POST_FAIL:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.slug]: RequestState.Failed,
        },
      };

    case LOAD_BACKGROUND_INIT:
      return {
        ...state,
        background: '',
      };

    case LOAD_BACKGROUND_SUCCESS:
      const background = action.background[Math.floor(Math.random() * action.background.length)];
      return {
        ...state,
        background: isMobile() ? background.mobile : background.desktop,
      };

    case LOAD_BACKGROUND_FAIL:
      return {
        ...state,
        background: isMobile() ? DEFAULT_BACKGROUND_MOBILE : DEFAULT_BACKGROUND,
      };

    case LOAD_ARCHIVE_INIT:
    case LOAD_ARCHIVE_SUCCESS:
    case LOAD_ARCHIVE_FAIL:
      const slug = state.archive[action.archiveType][action.slug] || [];

      switch (action.type) {
        case LOAD_ARCHIVE_INIT:
          slug[action.page] = RequestState.Loading;
          break;
        case LOAD_ARCHIVE_SUCCESS:
          slug[action.page] = action.archive;
          break;
        case LOAD_ARCHIVE_FAIL:
          slug[action.page] = RequestState.Failed;
          break;
      }

      return {
        ...state,
        archive: {
          ...state.archive,
          [action.archiveType]: {
            ...state.archive[action.archiveType],
            [action.slug]: slug,
          },
        },
      };

    default:
      return state;
  }
};
