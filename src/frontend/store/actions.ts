import { TermTypes } from 'src/frontend/constants/enum'

import { ActionPageHeader } from 'src/frontend/store/reducer'
import { ActionPublicClass } from 'src/frontend/store/reducer'
import { StateLeftRail } from 'src/frontend/store/reducer'

import { Archive } from 'src/frontend/store/items/archive'
import { Background } from 'src/frontend/store/items/background'
import { MenuItem } from 'src/frontend/store/items/menu-item'
import { Post } from 'src/frontend/store/items/post'
import { log } from 'src/frontend/utils/common'

export const SET_PUBLIC_CLASS = 'sujin/v1/SET_PUBLIC_CLASS'
export const SET_PAGE_HEADER = 'sujin/v1/SET_PAGE_HEADER'
export const SET_LEFT_RAIL = 'sujin/v1/SET_LEFT_RAIL'
export const LOAD_MENU_INIT = 'sujin/v1/LOAD_MENU_INIT'
export const LOAD_MENU_SUCCESS = 'sujin/v1/LOAD_MENU_SUCCESS'
export const LOAD_POST_INIT = 'sujin/v1/LOAD_POST_INIT'
export const LOAD_POST_SUCCESS = 'sujin/v1/LOAD_POST_SUCCESS'
export const LOAD_POST_FAIL = 'sujin/v1/LOAD_POST_FAIL'
export const LOAD_BACKGROUND_INIT = 'sujin/v1/LOAD_BACKGROUND_INIT'
export const LOAD_BACKGROUND_SUCCESS = 'sujin/v1/LOAD_BACKGROUND_SUCCESS'
export const LOAD_BACKGROUND_FAIL = 'sujin/v1/LOAD_BACKGROUND_FAIL'
export const LOAD_ARCHIVE_INIT = 'sujin/v1/LOAD_ARCHIVE_INIT'
export const LOAD_ARCHIVE_SUCCESS = 'sujin/v1/LOAD_ARCHIVE_SUCCESS'
export const LOAD_ARCHIVE_FAIL = 'sujin/v1/LOAD_ARCHIVE_FAIL'

export const setPublicClass = (publicClass: ActionPublicClass) => {
    log(SET_PUBLIC_CLASS)
    return {
        type: SET_PUBLIC_CLASS,
        publicClass,
    }
}

export const setPageHeader = (pageHeader: ActionPageHeader) => {
    log(SET_PAGE_HEADER)
    return {
        type: SET_PAGE_HEADER,
        pageHeader,
    }
}

export const setLeftRail = (leftRail: StateLeftRail) => {
    log(SET_PAGE_HEADER)
    return {
        type: SET_LEFT_RAIL,
        leftRail,
    }
}

export const loadMenuInit = (slug: string) => {
    log(LOAD_MENU_INIT)
    return {
        type: LOAD_MENU_INIT,
        slug,
    }
}

export const loadMenuSuccess = (slug: string, menuItems: MenuItem[]) => {
    log(LOAD_MENU_SUCCESS)
    return {
        type: LOAD_MENU_SUCCESS,
        slug,
        menuItems,
    }
}

export const loadPostInit = (slug: string) => {
    log(LOAD_POST_INIT)
    return {
        type: LOAD_POST_INIT,
        slug,
    }
}

export const loadPostSuccess = (slug: string, post: Post) => {
    log(LOAD_POST_SUCCESS)
    return {
        type: LOAD_POST_SUCCESS,
        slug,
        post,
    }
}

export const loadPostFail = (slug: string) => {
    log(LOAD_POST_FAIL)
    return {
        type: LOAD_POST_FAIL,
        slug,
    }
}

export const loadBackgroundInit = () => {
    log(LOAD_BACKGROUND_INIT)
    return {
        type: LOAD_BACKGROUND_INIT,
    }
}

export const loadBackgroundSuccess = (background: Background[]) => {
    log(LOAD_BACKGROUND_SUCCESS)
    return {
        type: LOAD_BACKGROUND_SUCCESS,
        background,
    }
}

export const loadBackgroundFail = () => {
    log(LOAD_BACKGROUND_FAIL)
    return {
        type: LOAD_BACKGROUND_FAIL,
    }
}

export const loadArchiveInit = (
    termType: TermTypes,
    slug: string,
    page: number,
) => {
    log(LOAD_ARCHIVE_INIT)
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
    archive: Archive,
) => {
    log(LOAD_ARCHIVE_SUCCESS)
    return {
        type: LOAD_ARCHIVE_SUCCESS,
        termType,
        slug,
        page,
        archive,
    }
}

export const loadArchiveFail = (
    termType: TermTypes,
    slug: string,
    page: number,
) => {
    log(LOAD_ARCHIVE_FAIL)
    return {
        type: LOAD_ARCHIVE_FAIL,
        termType,
        slug,
        page,
    }
}
