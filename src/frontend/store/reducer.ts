import { SET_PAGE_INFO } from 'src/frontend/store/actions'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Action, State } from 'src/types'

export const initialState: State = {
    pageInfo: {
        background: undefined,
        backgroundColor: '',
        excerpt: '',
        icon: undefined,
        isLoading: false,
        prefix: '',
        title: '',
        currentPage: '',
        wrapperClasses: {
            'wrapper--scrolled': false,
            'wrapper--mobile-menu': false,
            'wrapper--headline': false,
        },
    },
}

export const reducer = (state: State = initialState, action: Action): State => {
    switch (action.type) {
        case SET_PAGE_INFO: {
            return {
                ...state,
                pageInfo: {
                    ...state.pageInfo,
                    ...action.pageInfo,
                    wrapperClasses: {
                        ...state.pageInfo.wrapperClasses,
                        ...action.pageInfo.wrapperClasses,
                    },
                },
            }
        }

        default: {
            return state
        }
    }
}
