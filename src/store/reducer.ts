import type { Action, State } from '@src/store/type'
import { initialState } from '@src/store/constants'
import { ActionType } from '@src/store/constants'

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case ActionType.SET_BANNER: {
            return {
                ...state,
                banner: action.banner,
            }
        }

        case ActionType.SET_WRAPPER_CLASSES: {
            return {
                ...state,
                wrapperClass: action.wrapperClass,
            }
        }

        case ActionType.SET_MENU: {
            return {
                ...state,
                menu: action.menu,
            }
        }

        default: {
            return state
        }
    }
}
