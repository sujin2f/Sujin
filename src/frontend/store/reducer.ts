import type { Action, State } from 'src/frontend/store/type'
import { initialState } from 'src/frontend/store/constants'
import { ActionType } from 'src/frontend/store/constants'

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case ActionType.SET_CURRENT_PAGE: {
            return {
                ...state,
                currentPage: action.currentPage,
            }
        }

        case ActionType.SET_WRAPPER_CLASSES: {
            return {
                ...state,
                wrapperClasses: {
                    ...state.wrapperClasses,
                    ...action.wrapperClasses,
                },
            }
        }

        default: {
            return state
        }
    }
}
