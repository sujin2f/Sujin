/**
 * Store actions
 * @module frontend
 */
// import { TermTypes } from 'src/frontend/constants/enum'

// import { StatePageInfo } from 'src/frontend/store/reducer'
// import { StateLeftRail } from 'src/frontend/store/reducer'

// import { Archive } from 'src/frontend/store/items/archive'
import { Background, MenuItem } from 'src/types'
// import { Post } from 'src/frontend/store/items/post'
import { Action, PageInfo } from 'src/types/store'

// export const SET_PUBLIC_CLASS = 'sujin/v1/SET_PUBLIC_CLASS'
export const SET_PAGE_INFO = 'sujin/v1/SET_PAGE_HEADER'
// export const SET_LEFT_RAIL = 'sujin/v1/SET_LEFT_RAIL'
export const LOAD_MENU_INIT = 'sujin/v1/LOAD_MENU_INIT'
export const LOAD_MENU_SUCCESS = 'sujin/v1/LOAD_MENU_SUCCESS'
export const LOAD_MENU_FAIL = 'sujin/v1/LOAD_MENU_FAIL'

// export const LOAD_POST_INIT = 'sujin/v1/LOAD_POST_INIT'
// export const LOAD_POST_SUCCESS = 'sujin/v1/LOAD_POST_SUCCESS'
// export const LOAD_POST_FAIL = 'sujin/v1/LOAD_POST_FAIL'
export const LOAD_BACKGROUND_INIT = 'sujin/v1/LOAD_BACKGROUND_INIT'
export const LOAD_BACKGROUND_SUCCESS = 'sujin/v1/LOAD_BACKGROUND_SUCCESS'
export const LOAD_BACKGROUND_FAIL = 'sujin/v1/LOAD_BACKGROUND_FAIL'
// export const LOAD_ARCHIVE_INIT = 'sujin/v1/LOAD_ARCHIVE_INIT'
// export const LOAD_ARCHIVE_SUCCESS = 'sujin/v1/LOAD_ARCHIVE_SUCCESS'
// export const LOAD_ARCHIVE_FAIL = 'sujin/v1/LOAD_ARCHIVE_FAIL'

// export const setPublicClass = (publicClass: ActionPublicClass) => {
//     return {
//         type: SET_PUBLIC_CLASS,
//         publicClass,
//     }
// }

/**
 * To set pageInfo
 *
 * @param {Partial<PageInfo>} pageInfo
 * @returns {Partial<Action>}
 */
export const setPageInfo = (pageInfo: Partial<PageInfo>): Partial<Action> => {
    return {
        type: SET_PAGE_INFO,
        pageInfo,
    }
}

export const loadBackgroundInit = (): Partial<Action> => {
    return {
        type: LOAD_BACKGROUND_INIT,
    }
}

/**
 * Action after getBackgrounds() graphQL
 *
 * @param {Background[]} backgrounds
 * @returns {LoadBackgroundSuccess}
 */
export const loadBackgroundSuccess = (
    backgrounds: Background[],
): Partial<Action> => {
    return {
        type: LOAD_BACKGROUND_SUCCESS,
        backgrounds,
    }
}

export const loadBackgroundFail = (): Partial<Action> => {
    return {
        type: LOAD_BACKGROUND_FAIL,
    }
}

// export const setLeftRail = (leftRail: StateLeftRail) => {
//     return {
//         type: SET_LEFT_RAIL,
//         leftRail,
//     }
// }

/**
 * To initialize one menu
 *
 * @param {string} slug Menu slug
 * @returns {Partial<Action>}
 */
export const loadMenuInit = (slug: string): Partial<Action> => {
    return {
        type: LOAD_MENU_INIT,
        slug,
    }
}

export const loadMenuSuccess = (
    slug: string,
    menuItems: MenuItem[],
): Partial<Action> => {
    return {
        type: LOAD_MENU_SUCCESS,
        slug,
        menuItems,
    }
}

// export const loadPostInit = (slug: string) => {
//     return {
//         type: LOAD_POST_INIT,
//         slug,
//     }
// }

// export const loadPostSuccess = (slug: string, post: Post) => {
//     return {
//         type: LOAD_POST_SUCCESS,
//         slug,
//         post,
//     }
// }

// export const loadPostFail = (slug: string) => {
//     return {
//         type: LOAD_POST_FAIL,
//         slug,
//     }
// }

// export const loadArchiveInit = (
//     termType: TermTypes,
//     slug: string,
//     page: number,
// ) => {
//     return {
//         type: LOAD_ARCHIVE_INIT,
//         termType,
//         slug,
//         page,
//     }
// }

// export const loadArchiveSuccess = (
//     termType: TermTypes,
//     slug: string,
//     page: number,
//     archive: Archive,
// ) => {
//     return {
//         type: LOAD_ARCHIVE_SUCCESS,
//         termType,
//         slug,
//         page,
//         archive,
//     }
// }

// export const loadArchiveFail = (
//     termType: TermTypes,
//     slug: string,
//     page: number,
// ) => {
//     return {
//         type: LOAD_ARCHIVE_FAIL,
//         termType,
//         slug,
//         page,
//     }
// }
