/**
 * Store actions
 * @module frontend
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Image,
    MenuItem,
    Post,
    Action,
    PageInfo,
    TermTypes,
    Term,
    FlickrImage,
} from 'src/types'
/* eslint-enable @typescript-eslint/no-unused-vars */

export const SET_PAGE_INFO = 'sujin/v1/SET_PAGE_HEADER'

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

export const LOAD_FLICKR_INIT = 'sujin/v1/LOAD_FLICKR_INIT'
export const LOAD_FLICKR_SUCCESS = 'sujin/v1/LOAD_FLICKR_SUCCESS'
export const LOAD_FLICKR_FAIL = 'sujin/v1/LOAD_FLICKR_FAIL'
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
    backgrounds: Image[],
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
    term?: Term,
): Partial<Action> => {
    return {
        type: LOAD_ARCHIVE_SUCCESS,
        termType,
        slug,
        page,
        term,
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

export const loadFlickrInit = (): Partial<Action> => {
    return {
        type: LOAD_FLICKR_INIT,
    }
}

export const loadFlickrSuccess = (flickr: FlickrImage[]): Partial<Action> => {
    return {
        type: LOAD_FLICKR_SUCCESS,
        flickr,
    }
}

export const loadFlickrFail = (): Partial<Action> => {
    return {
        type: LOAD_FLICKR_FAIL,
    }
}
