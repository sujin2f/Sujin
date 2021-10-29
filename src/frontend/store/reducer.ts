import DEFAULT_BACKGROUND from 'src/assets/images/background/category.jpg'
import DEFAULT_BACKGROUND_MOBILE from 'src/assets/images/background/category-mobile.jpg'
// import {
//     RequestState,
//     // TermTypes,
//     WrapperClasses,
//     PageInfoBoolean,
//     PageInfoString,
// } from 'src/types/store'
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
    // SET_LEFT_RAIL,
} from 'src/frontend/store/actions'
import { Action, State } from 'src/types'
import { dummyPost } from 'src/constants'

// import { Archive } from 'src/frontend/store/items/archive'
// import { Background, MenuItem } from 'src/types'
// import { StoreBackgrounds } from 'src/types/store'
// import { Post } from 'src/frontend/store/items/post'
// import { isMobile } from 'src/frontend/utils/common'

/*
 * Response items
 */
// export type ResponseItem<T extends Archive | MenuItem[]> = {
//     state: RequestState
//     item?: T
// }
// export type StatePost = ResponseItem<Post>
// export type StateMenu = ResponseItem<MenuItem[]>
// export type StateArchive = ResponseItem<Archive>

// type ActionPageHeaderString = {
//     [keys in PageHeaderString]?: string
// }
// type ActionPageHeaderBoolean = {
//     [keys in PageHeaderBoolean]?: boolean
// }
// export type ActionPageHeader = ActionPageHeaderString & ActionPageHeaderBoolean

/*
 * Public Class
 */
// type StatePublicClassBase = {
//     [className in WrapperClasses]: boolean
// }
// type StatePublicClassWrapper = {
//     layout__wrapper: boolean
// }
// export type StatePublicClass = StatePublicClassBase & StatePublicClassWrapper
// export type ActionPublicClass = {
//     [className in WrapperClasses]?: boolean
// }

/*
 * misc
 */
// export type StateLeftRail = {
//     [title: string]: {
//         [menuTitle: string]: string
//     }
// }

export const initialState: State = {
    archive: {},
    backgrounds: undefined,
    menus: {},
    pageInfo: {
        background: '',
        backgroundColor: '',
        description: '',
        icon: '',
        isLoading: false,
        prefix: '',
        title: '',
        useBackgroundColor: false,
        wrapperClasses: {
            scrolled: false,
            'mobile-menu': false,
            'stretched-background': false,
            'hide-footer': false,
            layout__wrapper: true,
        },
    },
    posts: {},
    // leftRail: {},
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

        // case SET_LEFT_RAIL: {
        //     return {
        //         ...state,
        //         leftRail: action.leftRail,
        //     }
        // }

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
                        desktop: DEFAULT_BACKGROUND,
                        mobile: DEFAULT_BACKGROUND_MOBILE,
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
                    [post.slug]: post,
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
                        ...state.archive[archiveKey],
                        [action.page]: action.posts.map((post) => post.slug),
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
