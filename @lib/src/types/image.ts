import {
    IMAGE_SIZE_BACKGROUND,
    IMAGE_SIZE,
    POST_IMAGE_LOCATION,
} from '../constants'

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
