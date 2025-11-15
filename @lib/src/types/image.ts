/**
 * Common type definition
 */

import type { ConstToType } from '@sujin/share/types'

/**
 * Wordpress supported image sizes
 * @enum
 */
export const IMAGE_SIZE_BACKGROUND = {
    MEDIUM: 'medium',
    MEDIUM_LARGE: 'mediumLarge',
    LARGE: 'large',
} as const
export type IMAGE_SIZE_BACKGROUND = ConstToType<typeof IMAGE_SIZE_BACKGROUND>

/**
 * Wordpress supported image sizes
 * @enum
 */
export const IMAGE_SIZE = {
    ...IMAGE_SIZE_BACKGROUND,
    THUMBNAIL: 'thumbnail',
    POST_THUMBNAIL: 'postThumbnail',
    RELATED_POST: 'relatedPost',
    RECENT_POST: 'recentPost',
} as const
export type IMAGE_SIZE = ConstToType<typeof IMAGE_SIZE>

/**
 * Type of embed images from Wordpress Post
 * @enum
 */
export const POST_IMAGE_LOCATION = {
    LIST: 'list',
    ICON: 'icon',
    TITLE: 'title',
    BACKGROUND: 'background',
    THUMBNAIL: 'thumbnail',
} as const
export type POST_IMAGE_LOCATION = ConstToType<typeof POST_IMAGE_LOCATION>

// @todo use this
export enum IMAGE_POSITION {
    BANNER,
    LIST,
    ICON,
    RECENT_POST,
}

export type T_Image = {
    url: string
    width: number
    height: number
    mimeType: string
}

export type T_ImageSize = Partial<Record<IMAGE_SIZE, T_Image>>
export type T_ImageBlock = {
    width: number
    height: number
    url: string
    mimeType: string
    title: string
    sizes?: T_ImageSize
}
export type T_Background = T_ImageBlock & {
    _id: string
    sizes?: Partial<Record<IMAGE_SIZE_BACKGROUND, T_Image>>
}
export type T_PostImages = Partial<Record<POST_IMAGE_LOCATION, T_ImageBlock>>
