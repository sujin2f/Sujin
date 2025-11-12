'use client'
import { type ActionDispatch, createContext } from 'react'
import type {
    T_FlickrImage,
    T_Archive,
    T_Background,
    T_ArchivePost,
} from '@app/_lib/types'

type T_State = {
    flickr: T_FlickrImage[]
    tagCloud: T_Archive[]
    backgrounds: T_Background[]
    recent: T_ArchivePost[]
}

export const INITIAL_STATE: T_State = {
    flickr: [],
    tagCloud: [],
    backgrounds: [],
    recent: [],
}

export const Context = createContext<
    [T_State, ActionDispatch<[action: [string, unknown]]>]
>([INITIAL_STATE, () => {}])
