import { TermTypes } from 'src/types'
import { Background, MenuItem, Post } from './wp'

type Type = {
    type: string
}
type Slug = {
    slug: string
}

type Menus = {
    menus: {
        [slug: string]: MenuItem[]
    }
}

/**
 * Page Info
 */
type PageInfoString = {
    background: string
    backgroundColor: string
    description: string
    prefix: string
    title: string
    icon: string
}
type PageInfoBoolean = {
    isLoading: boolean
    useBackgroundColor: boolean
}
export type WrapperClasses = {
    scrolled: boolean
    'mobile-menu': boolean
    'stretched-background': boolean
    'hide-footer': boolean
    layout__wrapper: boolean
}
export type PageInfo = PageInfoString &
    PageInfoBoolean & {
        wrapperClasses: Partial<WrapperClasses>
    }

export type State = Menus & {
    backgrounds?: Background[]
    pageInfo: PageInfo
    posts: {
        [slug: string]: Post
    }
    archive: {
        [slug: string]: {
            [page: number]: string[] | 'Loading' | 'Failed'
        }
    }
    // leftRail: StateLeftRail
}

export type Action = Type &
    Slug & {
        posts: Post[]
        // leftRail: StateLeftRail
        menuItems: MenuItem[]
        backgrounds: Background[]
        pageInfo: Partial<PageInfo>
        page: number
        post: Post
        termType: TermTypes
    }
