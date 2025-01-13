import type { State } from '@src/store/type'

export enum ActionType {
    SET_BANNER = 'sujin/v9/SET_SET_BANNER',
    SET_WRAPPER_CLASSES = 'sujin/v9/SET_WRAPPER_CLASSES',
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
}
