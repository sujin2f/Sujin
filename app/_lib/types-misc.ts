import { ConstToType } from '@common/types'
import { ARCHIVE } from '@app/_lib/types-archive'
import { POST_TYPE } from '@app/_lib/types-post'

/**
 * MongoDB collections
 * @enum
 */
export const COLLECTION = {
    ...ARCHIVE,
    POST: POST_TYPE.POST,
    PAGE: POST_TYPE.PAGE,
    BACKGROUNDS: 'background',
    OPTIONS: 'option',
    SPECTRA: 'spectra',
    USERS: 'user',
} as const
export type COLLECTION = ConstToType<typeof COLLECTION>

/**
 * Cache prefixes
 * @enum
 */
export const CACHE_KEY = {
    ...ARCHIVE,
    POST: POST_TYPE.POST,
    PAGE: POST_TYPE.PAGE,
    BACKGROUNDS: COLLECTION.BACKGROUNDS,
} as const
export type CACHE_KEY = ConstToType<typeof CACHE_KEY>

/**
 * Menu names
 * @enum
 */
export const MENU_NAMES = {
    MAIN: 'main',
    DEV_TOOL: 'devtool',
    ETHER: 'ether',
    ETHER_KOR: 'ether-kor',
} as const
export type MENU_NAMES = ConstToType<typeof MENU_NAMES>

export type T_Option = {
    key: string
    value: string
}

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
