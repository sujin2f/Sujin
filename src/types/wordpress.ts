export enum ARCHIVE {
    CATEGORY = 'category',
    TAG = 'tag',
}

export enum POST_STATUS {
    PUBLISH = 'publish',
    DRAFT = 'draft',
    TRASH = 'trash',
}

export enum IMAGE_POSITION {
    LIST = 'list',
    HEADER = 'header',
    ICON = 'icon',
}

export type POST_TYPE = 'post' | 'page' | 'attachment'

// Image
export type ImageType = {
    key: string
    file: string
}

export type ImageBlockType = {
    mimeType: string
    title: string
    sizes: ImageType[]
    url: string
}

export type ImageKeysType =
    | 'list'
    | 'icon'
    | 'title'
    | 'background'
    | 'thumbnail'

export type ImagesType = {
    [key in ImageKeysType]: ImageBlockType
}

// Term: refers the category, tag as a property of post
// Archive: refers the archive page
export type TermType = {
    id: number
    title: string
    slug: string
    type: ARCHIVE
}

export type ArchiveType = Omit<TermType, 'type'> & {
    excerpt: string
    image?: ImageBlockType
    total: number
    hits: number
}

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
    images: Record<string, ImageBlockType>
    meta: {
        useBackgroundColor: boolean
        backgroundColor: string
    }
    status: POST_STATUS
}

export type MySQLPostType = PostType & {
    mimeType: string
}

export type PageType = Omit<PostType, 'terms'>

export const imageSizeMap: {
    [key in IMAGE_POSITION]: {
        'recent-post'?: string
        'post-thumbnail'?: string
        thumbnail?: string
        medium?: string
        medium_large?: string
        large?: string
    }
} = {
    [IMAGE_POSITION.HEADER]: {
        // medium: '(max-width: 480px)',
        medium_large: '(max-width: 768px)',
        large: '(max-width: 1024px)',
    },
    [IMAGE_POSITION.ICON]: {
        'recent-post': '(max-width: 480px)',
        'post-thumbnail': '(max-width: 768px)',
        large: '(max-width: 1024px)',
    },
    [IMAGE_POSITION.LIST]: {
        medium: '(max-width: 480px)',
        'post-thumbnail': '(max-width: 768px)',
        large: '(max-width: 1024px)',
    },
}

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
    sizes: Record<string, { file: string }>
}

export type PostMetaType = {
    meta_key: string
    meta_value: string
}

export type Named = Record<string, string>
export type AttrMatch = { named: Named; numeric: string[] }
