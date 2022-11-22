export enum PostType {
    POST = 'post',
    PAGE = 'page',
}

export enum ImageType {
    LIST = 'list',
    HEADER = 'header',
    ICON = 'icon',
}

export const imageSizeMap: {
    [key in ImageType]: {
        'recent-post'?: string
        'post-thumbnail'?: string
        thumbnail?: string
        medium?: string
        medium_large?: string
        large?: string
    }
} = {
    [ImageType.HEADER]: {
        // medium: '(max-width: 480px)',
        medium_large: '(max-width: 768px)',
        large: '(max-width: 1024px)',
    },
    [ImageType.ICON]: {
        'recent-post': '(max-width: 480px)',
        'post-thumbnail': '(max-width: 768px)',
        large: '(max-width: 1024px)',
    },
    [ImageType.LIST]: {
        medium: '(max-width: 480px)',
        'post-thumbnail': '(max-width: 768px)',
        large: '(max-width: 1024px)',
    },
}
