/* Components */
import { Cards } from '@app/archive/_components/Cards'
import { Paging } from '@app/_components/Paging'
/* T_Types */
import type { ColumnProps } from '@common/components/layout/Column'
import { type PropWithPages, IMAGE_SIZE, T_ArchivePost } from '@app/_lib/types'

type Props = ColumnProps & {
    readonly posts: Promise<PropWithPages<T_ArchivePost>>
    readonly keyPrefix: string
    readonly imageSize?: IMAGE_SIZE
    readonly page?: number
    readonly pageURLPrefix?: string
}

export const CardsServer = async ({
    posts: postsPromise,
    page,
    pageURLPrefix,
    ...props
}: Props) => {
    const { list, pages } = await postsPromise
    return (
        <>
            <Cards posts={list} {...props} />
            {page && pageURLPrefix ? (
                <Paging pages={pages} page={page} urlPrefix={pageURLPrefix} />
            ) : null}
        </>
    )
}
