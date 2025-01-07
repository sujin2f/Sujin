import { ActionType } from 'src/frontend/store/constants'

export type WrapperClasses = {
    'wrapper--scrolled': boolean
    'wrapper--mobile-menu': boolean
    'wrapper--headline': boolean
}

export type State = {
    currentPage: string
    wrapperClasses: Partial<WrapperClasses>
}

export type Action = State & {
    type: ActionType
}
