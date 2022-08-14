import { Image } from './wordpress'

type Type = {
    type: string
}

/**
 * Page Info
 */
export type WrapperClasses = {
    'wrapper--scrolled': boolean
    'wrapper--mobile-menu': boolean
    'wrapper--headline': boolean
}
export type State = {
    background?: Image
    backgroundColor: string
    excerpt: string
    prefix: string
    title: string
    icon?: Image
    isLoading: boolean
    currentPage: string
    wrapperClasses: Partial<WrapperClasses>
}

export type Action = {
    pageInfo: Partial<State>
} & Type
