import type { Action, Banner } from '@src/store/type'
import { ActionType } from '@src/store/constants'

export const setBanner = (banner: Banner): Partial<Action> => {
    return {
        type: ActionType.SET_BANNER,
        banner,
    }
}

export const setWrapperClass = (wrapperClass: string): Partial<Action> => {
    return {
        type: ActionType.SET_WRAPPER_CLASSES,
        wrapperClass,
    }
}

export const setMenu = (menu: string): Partial<Action> => {
    return {
        type: ActionType.SET_MENU,
        menu,
    }
}
