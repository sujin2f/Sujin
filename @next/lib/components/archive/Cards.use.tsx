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

type Props = ColumnProps & {
    readonly posts: Promise<PropWithPages<T_ArchivePost>>
    readonly keyPrefix: string
    readonly imageSize?: IMAGE_SIZE
    readonly page?: number
    readonly pageURLPrefix?: string
}

export const Cards = ({ posts: promise, ...props }: Props) => {
    const posts = use(promise)
    return <CardsComponent posts={posts} {...props} />
}
