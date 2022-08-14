import { Action, State } from 'src/types/store'
export const SET_PAGE_INFO = 'sujin/v1/SET_PAGE_HEADER'

/**
 * To set pageInfo
 *
 * @param {Partial<PageInfo>} pageInfo
 * @returns {Partial<Action>}
 */
export const setPageInfo = (pageInfo: Partial<State>): Partial<Action> => {
    return {
        type: SET_PAGE_INFO,
        pageInfo,
    }
}
