import { Action, PageInfo } from 'src/types'
export const SET_PAGE_INFO = 'sujin/v1/SET_PAGE_HEADER'

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
