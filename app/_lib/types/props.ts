import type { ReactNode } from 'react'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types/misc'
/* T_Types */
import type { T_ImageBlock } from '@app/_lib/types/image'
import type { ARCHIVE_URL } from '@app/_lib/types/archive'
import { T_ArchivePost } from '@app/_lib/types/post'

export type BannerProps = {
    readonly title?: string | ReactNode
    readonly excerpt?: string | ReactNode
    readonly icon?: T_ImageBlock
    readonly prefix?: string
    readonly background?: T_ImageBlock
    readonly backgroundColor?: string
    readonly menu?: MENU_NAMES
}

export type ArchiveProp = {
    type: ARCHIVE_URL
    slug: string
    page: number
}

export type ArchivePostsProp = {
    readonly posts: T_ArchivePost[]
    readonly pages: number
}
