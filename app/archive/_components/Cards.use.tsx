import { use } from 'react'
/* Components */
import { Cards as CardsComponent } from '@app/archive/_components/Cards'
/* T_Types */
import type { ColumnProps } from '@sujin/common/components/layout/Column'
import {
    IMAGE_SIZE,
    type PropWithPages,
    type T_ArchivePost,
} from '@app/_lib/types'

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
