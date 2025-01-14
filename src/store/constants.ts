import { MenuNames } from '@src/constants/mysql-query'
import type { State } from '@src/store/type'

export enum ActionType {
    SET_BANNER = 'sujin/v9/SET_SET_BANNER',
    SET_WRAPPER_CLASSES = 'sujin/v9/SET_WRAPPER_CLASSES',
    SET_MENU = 'sujin/v9/SET_SET_MENU',
}

export const initialState: State = {
    wrapperClass: '',
    banner: {
        title: '',
        excerpt: '',
        icon: undefined,
        prefix: undefined,
        background: undefined,
        backgroundColor: undefined,
    },
    menu: MenuNames.MAIN,
}
