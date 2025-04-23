import { notFound } from 'next/navigation'
/* Components */
import { Cards } from '@app/_components/archive/cards'
import { Paging } from '@app/_components/archive/paging'
/* T_Types */
import type { ColumnProps } from '@common/components/layout/Column'
import { type PropWithPages, IMAGE_SIZE, T_ArchivePost } from '@app/_lib/types'

type Props = ColumnProps & {
    readonly posts: Promise<PropWithPages<T_ArchivePost>>
    readonly keyPrefix: string
    readonly imageSize?: IMAGE_SIZE
    readonly page?: number
    readonly pageURLPrefix?: string
    readonly showNotFound?: boolean
}

export const CardsServer = async ({
    posts: postsPromise,
    page,
    pageURLPrefix,
    showNotFound = true,
    ...props
}: Props) => {
    const { list, pages } = await postsPromise.catch(() => {
        if (showNotFound) notFound()
        return { list: [], pages: 0 }
    })

    if (!list.length) {
        if (showNotFound) notFound()
        return <></>
    }
    return (
        <>
            <Cards posts={list} {...props} />
            {page && pageURLPrefix ? (
                <Paging pages={pages} page={page} urlPrefix={pageURLPrefix} />
            ) : null}
        </>
    )
}
