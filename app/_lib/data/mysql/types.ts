import type { ARCHIVE } from '@app/_lib/data/types'

export enum POST_STATUS {
    PUBLISH = 'publish',
    DRAFT = 'draft',
    TRASH = 'trash',
}

export enum POST_TYPE {
    POST = 'post',
    PAGE = 'page',
    ATTACHMENT = 'attachment',
}

export enum IMAGE_SIZE {
    MEDIUM = 'medium',
    THUMBNAIL = 'thumbnail',
    MEDIUM_LARGE = 'mediumLarge',
    LARGE = 'large',
    POST_THUMBNAIL = 'postThumbnail',
    RELATED_POST = 'relatedPost',
    RECENT_POST = 'recentPost',
}

// Image
export type ImageType = {
    url: string
    width: number
    height: number
    mimeType: string
}

export type ImageSizeType = Partial<{
    [key in IMAGE_SIZE]: ImageType
}>

export type ImageBlockType = {
    width: number
    height: number
    url: string
    mimeType: string
    title: string
    sizes?: ImageSizeType
}

export enum IMAGE_TYPE {
    LIST = 'list',
    ICON = 'icon',
    TITLE = 'title',
    BACKGROUND = 'background',
    THUMBNAIL = 'thumbnail',
}

export type ImagesType = Partial<{
    [key in IMAGE_TYPE]: ImageBlockType
}>

/// @todo use this
export enum IMAGE_POSITION {
    BANNER,
    LIST,
    ICON,
    RECENT_POST,
}

// Term: refers the category, tag as a property of post
// Archive: refers the archive page
export type TermType = {
    id: number
    title: string
    slug: string
    type: ARCHIVE
}

export type CategoryType = Omit<TermType, 'type'> & {
    excerpt: string
    image?: ImageBlockType
    total: number
}

export type TagType = CategoryType & {
    hits: number
}

export type ArchiveType = CategoryType

// Post and Page
export type PostType = {
    id: number
    slug: string
    title: string
    excerpt: string
    content: string
    date: number
    terms: TermType[]
    link: string
    images: ImagesType
    meta: {
        useBackgroundColor: boolean
        backgroundColor: string
    }
    status: POST_STATUS
}

export type MySQLPostType = PostType & {
    mimeType: string
    type: string
}

export type PageType = Omit<PostType, 'terms'>

export type OptionType = { option_value: string }

export type MenuItem = {
    id: number
    title: string
    target: string
    link: string
    htmlClass: string[]
    children: MenuItem[]
    parent: number
}

export type MySQLMediaType = {
    file: string
    width: number
    height: number
    sizes: Record<
        string,
        { file: string; width: number; height: number; 'mime-type': string }
    >
}

export type PostMetaType = {
    meta_key: string
    meta_value: string
}

export type Named = Record<string, string>
export type AttrMatch = { named: Named; numeric: string[] }
