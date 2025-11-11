import type { WithId } from 'mongodb'
import type { ConstToType } from '@common/types'
import { POST_TYPE } from '@lib/types/post'

/**
 * MongoDB collections
 * @enum
 */
export const COLLECTION = {
    POST: POST_TYPE.POST,
    PAGE: POST_TYPE.PAGE,
    BACKGROUNDS: 'background',
    OPTIONS: 'option',
    SPECTRA: 'spectra',
    USERS: 'user',
    ARCHIVE: 'archive',
    SNIPPET: 'snippet',
    SNIPPETS: 'snippets',
    RECIPE: 'recipe',
} as const
export type COLLECTION = ConstToType<typeof COLLECTION>

/**
 * Menu names
 * @enum
 */
export const MENU_NAMES = {
    MAIN: 'main',
    DEV_TOOL: 'devtool',
    ETHER: 'ether',
    ETHER_KOR: 'ether-kor',
    DESIGN_SYSTEM: 'design-system',
} as const
export type MENU_NAMES = ConstToType<typeof MENU_NAMES>

export type T_Option = WithId<{
    key: string
    value: string
}>

export type T_ShortcodeNamed = Record<string, string>
export type T_ShortcodeAttrMatch = {
    named: T_ShortcodeNamed
    numeric: string[]
}

export type T_FlickrImage = {
    title: string
    link: string
    media: string
}

type T_FlickrResponseImage = {
    title: string
    link: string
    media: {
        m: string
    }
}

export type T_FlickrResponse = {
    items: T_FlickrResponseImage[]
}
