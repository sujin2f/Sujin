import { ARCHIVE, POST_TYPE } from '../constants'

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

export type RedisMessageWordpress = {
    type: ARCHIVE | POST_TYPE
    action: 'update' | 'remove'
    slug: string
    page?: number
}
