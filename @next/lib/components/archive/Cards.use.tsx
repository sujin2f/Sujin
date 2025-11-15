import { use } from 'react'
/* Components */
import { Cards as CardsComponent } from '@lib/components/archive/Cards'
/* T_Types */
import type { ColumnProps } from '@common/components/layout/Column'
import {
    IMAGE_SIZE,
    type PropWithPages,
    type T_ArchivePost,
} from '@sujin/lib/types'

type Props<T extends string> = ColumnProps & {
    readonly posts: Promise<PropWithPages<T_ArchivePost, T>>
    readonly listKey: T
    readonly keyPrefix: string
    readonly imageSize?: IMAGE_SIZE
    readonly page?: number
    readonly pageURLPrefix?: string
}

export const Cards = <T extends string>({
    posts: promise,
    ...props
}: Props<T>) => {
    const posts = use(promise)
    return <CardsComponent posts={posts} {...props} />
}
