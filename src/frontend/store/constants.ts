import type { State } from '@src/frontend/store/type'

export enum ActionType {
    SET_CURRENT_PAGE = 'sujin/v9/SET_CURRENT_PAGE',
    SET_WRAPPER_CLASSES = 'sujin/v9/SET_WRAPPER_CLASSES',
}

export const initialState: State = {
    currentPage: '',
    wrapperClasses: {
        'wrapper--scrolled': false,
        'wrapper--mobile-menu': false,
        'wrapper--headline': false,
    },
}
