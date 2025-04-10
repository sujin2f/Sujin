import type { ReactNode } from 'react'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types/misc'
/* Types */
import type { T_ImageBlock } from '@app/_lib/types/image'
import type { ARCHIVE_URL } from '@app/_lib/types/archive'

export type BannerProps = {
    readonly title?: string | ReactNode
    readonly excerpt?: string
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
