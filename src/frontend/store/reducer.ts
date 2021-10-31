import DEFAULT_BACKGROUND from 'src/assets/images/background/category.jpg'
import DEFAULT_BACKGROUND_MOBILE from 'src/assets/images/background/category-mobile.jpg'

import {
    SET_PAGE_INFO,
    LOAD_MENU_INIT,
    LOAD_MENU_SUCCESS,
    LOAD_MENU_FAIL,
    LOAD_POST_INIT,
    LOAD_POST_SUCCESS,
    LOAD_POST_FAIL,
    LOAD_BACKGROUND_INIT,
    LOAD_BACKGROUND_SUCCESS,
    LOAD_BACKGROUND_FAIL,
    LOAD_ARCHIVE_INIT,
    LOAD_ARCHIVE_SUCCESS,
    LOAD_ARCHIVE_FAIL,
} from 'src/frontend/store/actions'
import { Action, State } from 'src/types'
import { dummyPost } from 'src/constants'

export const initialState: State = {
    archive: {},
    backgrounds: undefined,
    menus: {},
    pageInfo: {
        background: undefined,
        backgroundColor: '',
        excerpt: '',
        icon: undefined,
        isLoading: false,
        prefix: '',
        title: '',
        currentPage: '',
        wrapperClasses: {
            'wrapper--scrolled': false,
            'wrapper--mobile-menu': false,
            'wrapper--headline': false,
        },
    },
    posts: {},
}

export const reducer = (state: State = initialState, action: Action): State => {
    const archiveKey = `${action.termType}__${action.slug}`
    switch (action.type) {
        case SET_PAGE_INFO: {
            return {
                ...state,
                pageInfo: {
                    ...state.pageInfo,
                    ...action.pageInfo,
                    wrapperClasses: {
                        ...state.pageInfo.wrapperClasses,
                        ...action.pageInfo.wrapperClasses,
                    },
                },
            }
        }

        case LOAD_MENU_INIT: {
            return {
                ...state,
                menus: {
                    ...state.menus,
                    [action.slug]: [],
                },
            }
        }

        case LOAD_MENU_SUCCESS: {
            return {
                ...state,
                menus: {
                    ...state.menus,
                    [action.slug]: action.menuItems,
                },
            }
        }

        case LOAD_MENU_FAIL: {
            return {
                ...state,
                menus: {
                    ...state.menus,
                    [action.slug]: [],
                },
            }
        }

        case LOAD_POST_INIT: {
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.slug]: {
                        ...dummyPost,
                        date: 'Loading',
                    },
                },
            }
        }

        case LOAD_POST_SUCCESS: {
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.slug]: action.post,
                },
            }
        }

        case LOAD_POST_FAIL: {
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [action.slug]: {
                        ...dummyPost,
                        date: 'Failed',
                    },
                },
            }
        }

        case LOAD_BACKGROUND_INIT: {
            return {
                ...state,
                backgrounds: [],
            }
        }

        case LOAD_BACKGROUND_SUCCESS: {
            return {
                ...state,
                backgrounds: action.backgrounds,
            }
        }

        case LOAD_BACKGROUND_FAIL: {
            return {
                ...state,
                backgrounds: [
                    {
                        url: DEFAULT_BACKGROUND,
                        mimeType: 'image/jpeg',
                        sizes: [
                            {
                                key: 'medium',
                                file: DEFAULT_BACKGROUND_MOBILE,
                            },
                        ],
                    },
                ],
            }
        }

        case LOAD_ARCHIVE_INIT:
            return {
                ...state,
                archive: {
                    ...state.archive,
                    [archiveKey]: {
                        ...state.archive[archiveKey],
                        [action.page]: 'Loading',
                    },
                },
            }

        case LOAD_ARCHIVE_SUCCESS:
            const posts = action.posts.reduce((prev, post) => {
                return {
                    ...prev,
                    [decodeURIComponent(post.slug)]: post,
                }
            }, {})

            return {
                ...state,
                posts: {
                    ...state.posts,
                    ...posts,
                },
                archive: {
                    ...state.archive,
                    [archiveKey]: {
                        term: action.term,
                        items: {
                            ...state.archive[archiveKey],
                            [action.page]: action.posts.map((post) =>
                                decodeURIComponent(post.slug),
                            ),
                        },
                    },
                },
            }

        case LOAD_ARCHIVE_FAIL: {
            return {
                ...state,
                archive: {
                    ...state.archive,
                    [archiveKey]: {
                        ...state.archive[archiveKey],
                        [action.page]: 'Failed',
                    },
                },
            }
        }

        default: {
            return state
        }
    }
}
