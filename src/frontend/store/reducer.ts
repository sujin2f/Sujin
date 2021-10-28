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
    // LOAD_POST_INIT,
    // LOAD_POST_SUCCESS,
    // LOAD_POST_FAIL,
    LOAD_BACKGROUND_INIT,
    LOAD_BACKGROUND_SUCCESS,
    LOAD_BACKGROUND_FAIL,
    // LOAD_ARCHIVE_INIT,
    // LOAD_ARCHIVE_SUCCESS,
    // LOAD_ARCHIVE_FAIL,
    // SET_LEFT_RAIL,
} from 'src/frontend/store/actions'
import { Action, State } from 'src/types/store'
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
    // archive: {
    //     category: {},
    //     tag: {},
    //     search: {},
    //     recentPosts: {},
    // },
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
    // posts: {},
    // leftRail: {},
}

export const reducer = (state: State = initialState, action: Action): State => {
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

        // case LOAD_POST_INIT: {
        //     return {
        //         ...state,
        //         posts: {
        //             ...state.posts,
        //             [action.slug]: {
        //                 state: 'Loading',
        //             },
        //         },
        //     }
        // }

        // case LOAD_POST_SUCCESS: {
        //     return {
        //         ...state,
        //         posts: {
        //             ...state.posts,
        //             [action.slug]: {
        //                 state: 'Success',
        //                 item: action.post,
        //             },
        //         },
        //     }
        // }

        // case LOAD_POST_FAIL: {
        //     return {
        //         ...state,
        //         posts: {
        //             ...state.posts,
        //             [action.slug]: {
        //                 state: 'Failed',
        //             },
        //         },
        //     }
        // }

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

        // case LOAD_ARCHIVE_INIT:
        // case LOAD_ARCHIVE_SUCCESS:
        // case LOAD_ARCHIVE_FAIL: {
        //     const slugNode = state.archive[action.termType][action.slug] || []

        //     switch (action.type) {
        //         case LOAD_ARCHIVE_INIT:
        //             slugNode[action.page] = {
        //                 state: 'Loading',
        //             }
        //             break
        //         case LOAD_ARCHIVE_SUCCESS:
        //             slugNode[action.page] = {
        //                 state: 'Success',
        //                 item: action.archive,
        //             }
        //             break
        //         case LOAD_ARCHIVE_FAIL:
        //             slugNode[action.page] = {
        //                 state: 'Failed',
        //             }
        //             break
        //     }

        //     return {
        //         ...state,
        //         archive: {
        //             ...state.archive,
        //             [action.termType]: {
        //                 ...state.archive[action.termType],
        //                 [action.slug]: slugNode,
        //             },
        //         },
        //     }
        // }

        default: {
            return state
        }
    }
}
