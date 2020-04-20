import DEFAULT_BACKGROUND from 'assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from 'assets/images/background/category-mobile.jpg';
import {
  RequestState,
  TermTypes,
  PublicClasses,
  PageHeaderString,
  PageHeaderBoolean,
} from 'constants/enum';
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
  SET_LEFT_RAIL,
} from 'store/actions';
import { Archive } from 'store/items/archive';
import { Background } from 'store/items/background';
import { Menu } from 'store/items/menu';
import { Post } from 'store/items/post';
import { isMobile } from 'utils/common';

/*
 * REST items
 * @todo background
 */
export type ResponseItem<T extends Archive | Post | Menu[]> = {
  state: RequestState;
  item?: T;
};
export type StatePost = ResponseItem<Post>;
export type StateMenu = ResponseItem<Menu[]>;
export type StateArchive = ResponseItem<Archive>;

/*
 * Page Header
 */
type StatePageHeaderString = {
  [optionKey1 in PageHeaderString]: string;
};
type StatePageHeaderBoolean = {
  [optionKey1 in PageHeaderBoolean]: boolean;
};
export type StatePageHeader = StatePageHeaderString & StatePageHeaderBoolean;

type ActionPageHeaderString = {
  [optionKey1 in PageHeaderString]?: string;
};
type ActionPageHeaderBoolean = {
  [optionKey1 in PageHeaderBoolean]?: boolean;
};
export type ActionPageHeader = ActionPageHeaderString & ActionPageHeaderBoolean;

/*
 * Public Class
 */
type StatePublicClassBase = {
  [className in PublicClasses]: boolean;
};
type StatePublicClassWrapper = {
  'layout__wrapper': boolean;
};
export type StatePublicClass = StatePublicClassBase & StatePublicClassWrapper;
export type ActionPublicClass = {
  [className in PublicClasses]?: boolean;
};

/*
 * misc
 */
export type StateLeftRail = {
  [title: string]: {
    [menuTitle: string]: string;
  };
};

export type State = {
  archive: {
    [termTypes in TermTypes]: {
      [slug: string]: StateArchive[];
    };
  };
  background: string;
  leftRail: StateLeftRail;
  menu: {
    [slug: string]: StateMenu;
  };
  pageHeader: StatePageHeader;
  posts: {
    [slug: string]: StatePost;
  };
  publicClass: StatePublicClass;
};

export const initialState: State = {
  archive: {
    category: {},
    tag: {},
    search: {},
    recentPosts: {},
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
    scrolled: false,
    'mobile-menu': false,
    'stretched-background': false,
    'hide-footer': false,
    'hide-header': false,
    'layout__wrapper': true,
  },
  leftRail: {},
};

type Action = {
  archive: Archive;
  background: Background[];
  leftRail: StateLeftRail;
  menuItems: Menu[];
  page: number;
  pageHeader: ActionPageHeader;
  post: Post;
  publicClass: ActionPublicClass;
  slug: string;
  termType: TermTypes;
  type: string;
};

export const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case SET_PUBLIC_CLASS: {
      return {
        ...state,
        publicClass: {
          ...state.publicClass,
          ...action.publicClass,
        },
      };
    }

    case SET_PAGE_HEADER: {
      return {
        ...state,
        pageHeader: {
          ...state.pageHeader,
          ...action.pageHeader,
        },
      };
    }

    case SET_LEFT_RAIL: {
      return {
        ...state,
        leftRail: action.leftRail,
      };
    }

    case LOAD_MENU_INIT: {
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.slug]: {
            state: 'Loading',
          },
        },
      };
    }

    case LOAD_MENU_SUCCESS: {
      return {
        ...state,
        menu: {
          ...state.menu,
          [action.slug]: {
            state: 'Success',
            item: action.menuItems,
          },
        },
      };
    }

    case LOAD_POST_INIT: {
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.slug]: {
            state: 'Loading',
          },
        },
      };
    }

    case LOAD_POST_SUCCESS: {
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.slug]: {
            state: 'Success',
            item: action.post,
          },
        },
      };
    }

    case LOAD_POST_FAIL: {
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.slug]: {
            state: 'Failed',
          },
        },
      };
    }

    case LOAD_BACKGROUND_INIT: {
      return {
        ...state,
        background: '',
      };
    }

    case LOAD_BACKGROUND_SUCCESS: {
      const background = action.background[Math.floor(Math.random() * action.background.length)];
      return {
        ...state,
        background: isMobile() ? background.mobile : background.desktop,
      };
    }

    case LOAD_BACKGROUND_FAIL: {
      return {
        ...state,
        background: isMobile() ? DEFAULT_BACKGROUND_MOBILE : DEFAULT_BACKGROUND,
      };
    }

    case LOAD_ARCHIVE_INIT:
    case LOAD_ARCHIVE_SUCCESS:
    case LOAD_ARCHIVE_FAIL: {
      const slugNode = state.archive[action.termType][action.slug] || [];

      switch (action.type) {
        case LOAD_ARCHIVE_INIT:
          slugNode[action.page] = {
            state: 'Loading',
          };
          break;
        case LOAD_ARCHIVE_SUCCESS:
          slugNode[action.page] = {
            state: 'Success',
            item: action.archive,
          };
          break;
        case LOAD_ARCHIVE_FAIL:
          slugNode[action.page] = {
            state: 'Failed',
          };
          break;
      }

      return {
        ...state,
        archive: {
          ...state.archive,
          [action.termType]: {
            ...state.archive[action.termType],
            [action.slug]: slugNode,
          },
        },
      };
    }

    default: {
      return state;
    }
  }
};
