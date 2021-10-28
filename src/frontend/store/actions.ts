/**
 * Store actions
 * @module frontend
 */

import { Background, MenuItem, Post } from 'src/types'
import { Action, PageInfo } from 'src/types/store'
import { TermTypes } from '../constants/enum'

export const SET_PAGE_INFO = 'sujin/v1/SET_PAGE_HEADER'
// export const SET_LEFT_RAIL = 'sujin/v1/SET_LEFT_RAIL'
export const LOAD_MENU_INIT = 'sujin/v1/LOAD_MENU_INIT'
export const LOAD_MENU_SUCCESS = 'sujin/v1/LOAD_MENU_SUCCESS'
export const LOAD_MENU_FAIL = 'sujin/v1/LOAD_MENU_FAIL'

export const LOAD_POST_INIT = 'sujin/v1/LOAD_POST_INIT'
export const LOAD_POST_SUCCESS = 'sujin/v1/LOAD_POST_SUCCESS'
export const LOAD_POST_FAIL = 'sujin/v1/LOAD_POST_FAIL'

export const LOAD_BACKGROUND_INIT = 'sujin/v1/LOAD_BACKGROUND_INIT'
export const LOAD_BACKGROUND_SUCCESS = 'sujin/v1/LOAD_BACKGROUND_SUCCESS'
export const LOAD_BACKGROUND_FAIL = 'sujin/v1/LOAD_BACKGROUND_FAIL'

export const LOAD_ARCHIVE_INIT = 'sujin/v1/LOAD_ARCHIVE_INIT'
export const LOAD_ARCHIVE_SUCCESS = 'sujin/v1/LOAD_ARCHIVE_SUCCESS'
export const LOAD_ARCHIVE_FAIL = 'sujin/v1/LOAD_ARCHIVE_FAIL'

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

export const loadPostInit = (slug: string): Partial<Action> => {
    return {
        type: LOAD_POST_INIT,
        slug,
    }
}

export const loadPostSuccess = (slug: string, post: Post): Partial<Action> => {
    return {
        type: LOAD_POST_SUCCESS,
        slug,
        post,
    }
}

export const loadPostFail = (slug: string): Partial<Action> => {
    return {
        type: LOAD_POST_FAIL,
        slug,
    }
}

export const loadArchiveInit = (
    termType: TermTypes,
    slug: string,
    page: number,
): Partial<Action> => {
    return {
        type: LOAD_ARCHIVE_INIT,
        termType,
        slug,
        page,
    }
}

export const loadArchiveSuccess = (
    termType: TermTypes,
    slug: string,
    page: number,
    posts: Post[],
): Partial<Action> => {
    return {
        type: LOAD_ARCHIVE_SUCCESS,
        termType,
        slug,
        page,
        posts,
    }
}

export const loadArchiveFail = (
    termType: TermTypes,
    slug: string,
    page: number,
): Partial<Action> => {
    return {
        type: LOAD_ARCHIVE_FAIL,
        termType,
        slug,
        page,
    }
}
