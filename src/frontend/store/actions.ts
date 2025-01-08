import type { Action, WrapperClasses } from 'src/frontend/store/type'
import { ActionType } from 'src/frontend/store/constants'

export const setCurrentPage = (currentPage: string): Partial<Action> => {
    return {
        type: ActionType.SET_CURRENT_PAGE,
        currentPage,
    }
}

export const setWrapperClasses = (
    wrapperClasses: Partial<WrapperClasses>,
): Partial<Action> => {
    return {
        type: ActionType.SET_WRAPPER_CLASSES,
        wrapperClasses,
    }
}
