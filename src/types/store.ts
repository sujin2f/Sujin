import { Background, MenuItem } from './wp'

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

// export type PartialPageInfo = Partial<PageInfoString> &
//     Partial<PageInfoBoolean> & {
//         wrapperClasses?: Partial<WrapperClasses>
//     }
// export type PageInfoOfAction = {
//     pageInfo: PartialPageInfo
// }
export type State = Menus & {
    backgrounds?: Background[]
    pageInfo: PageInfo
    // archive: {
    //     [termTypes in TermTypes]: {
    //         [slug: string]: StateArchive[]
    //     }
    // }
    // leftRail: StateLeftRail
    // posts: {
    //     [slug: string]: StatePost
    // }
}

export type Action = Type &
    Slug & {
        // archive: Archive
        // leftRail: StateLeftRail
        menuItems: MenuItem[]
        backgrounds: Background[]
        pageInfo: Partial<PageInfo>
        // page: number
        // post: Post
        // termType: TermTypes
    }
