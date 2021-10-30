import { Post } from 'src/types'

export const dummyPost: Post = {
    id: 0,
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    date: '',
    link: '',
    parent: 0,
    type: '',
    menuOrder: 0,
    tags: [],
    categories: [],
    series: [],
    mimeType: '',
    images: {},
    meta: {
        backgroundColor: '',
        useBackgroundColor: false,
    },
}

export enum PostType {
    POST = 'post',
    PAGE = 'page',
}

export enum ImageType {
    HEADER = 'header',
}

export const imageSizeMap: {
    [key in ImageType]: {
        thumbnail?: string
        medium?: string
        medium_large?: string
        large?: string
    }
} = {
    [ImageType.HEADER]: {
        medium: '(max-width: 480px)',
        medium_large: '(max-width: 768px)',
        large: '(max-width: 1024px)',
    },
}
