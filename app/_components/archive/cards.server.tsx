import { notFound } from 'next/navigation'
/* Components */
import { Cards } from '@app/_components/archive/cards'
import { Paging } from '@app/_components/archive/paging'
/* T_Types */
import type { ColumnProps } from '@common/components/layout/Column'
import { type ArchivePostsProp, IMAGE_SIZE } from '@app/_lib/types'

type Props = ColumnProps & {
    readonly posts: Promise<ArchivePostsProp>
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
    const { posts, pages } = await postsPromise.catch(() => {
        if (showNotFound) notFound()
        return { posts: [], pages: 0 }
    })

    if (!posts.length) {
        if (showNotFound) notFound()
        return <></>
    }
    return (
        <>
            <Cards posts={posts} {...props} />
            {page && pageURLPrefix ? (
                <Paging pages={pages} page={page} urlPrefix={pageURLPrefix} />
            ) : null}
        </>
    )
}
