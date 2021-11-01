// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FlickrImage, Term, TermTypes } from 'src/types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Image, MenuItem, Post } from './wordpress'

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
export type WrapperClasses = {
    'wrapper--scrolled': boolean
    'wrapper--mobile-menu': boolean
    'wrapper--headline': boolean
}
export type PageInfo = {
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

export type State = {
    backgrounds?: Image[]
    pageInfo: PageInfo
    posts: {
        [slug: string]: Post
    }
    archive: {
        [slug: string]: {
            term?: Term
            items: {
                [page: number]: string[] | 'Loading' | 'Failed'
            }
        }
    }
    flickr?: FlickrImage[]
} & Menus

export type Action = {
    posts: Post[]
    menuItems: MenuItem[]
    backgrounds: Image[]
    pageInfo: Partial<PageInfo>
    page: number
    post: Post
    termType: TermTypes
    term: Term
    flickr: FlickrImage[]
} & Type &
    Slug
