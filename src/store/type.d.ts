import { ActionType } from '@src/store/constants'

export type Banner = {
    title: string | JSX.Element
    excerpt: string
    icon?: Image
    prefix?: string
    background?: Image
    backgroundColor?: string
}

export type State = {
    wrapperClass: string
    banner: Banner
}

export type Action = State & {
    type: ActionType
}
