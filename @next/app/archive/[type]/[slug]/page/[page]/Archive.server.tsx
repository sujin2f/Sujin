import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards.use'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import CATEGORY_QUERY from '@lib/apollo/queries/wordpress/archives/category.graphql'
import TAG_QUERY from '@lib/apollo/queries/wordpress/archives/tag.graphql'
import POST_LIST_QUERY from '@lib/apollo/queries/wordpress/posts/posts.graphql'
/* Utils */
import { updateHits } from '@lib/apollo/queries/wordpress/archives/updateHits'
import { cachedGQLRequest } from '@lib/apollo/queries/GQLRequest'
/* T_Types */
import type { WithNumPages, T_Archive, T_ArchivePost } from '@sujin/lib/types'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    const archive = await cachedGQLRequest<{ archive: T_Archive }>(
        type === ARCHIVE.CATEGORY ? CATEGORY_QUERY : TAG_QUERY,
        { slug, type },
        [COLLECTION.ARCHIVE, type, slug],
    )
        .then((result) => {
            if (!result.data || !result.data.archive) {
                notFound()
            }
            return result.data.archive
        })
        .catch(() => notFound())

    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        await updateHits(slug)
    }

    const posts = cachedGQLRequest<{
        posts: WithNumPages<T_ArchivePost, 'items'>
    }>(
        POST_LIST_QUERY,
        { type, page, slug },
        [COLLECTION.ARCHIVE, 'posts', type, slug, page.toString()], // TODO
    )
        .then((result) => {
            if (!result.data) {
                return {
                    items: [] as T_ArchivePost[],
                    numPages: 1,
                }
            }
            return result.data.posts
        })
        .catch(() => ({
            items: [] as T_ArchivePost[],
            numPages: 1,
        }))

    return (
        <Wrapper
            title={title}
            excerpt={excerpt}
            prefix={type}
            background={image}
        >
            <Suspense fallback={<LoadingArchive />}>
                <Cards
                    keyPrefix={`${type}-${slug}-${page}`}
                    posts={posts}
                    listKey="items"
                    page={page}
                    pageURLPrefix={`/${type}/${slug}/page`}
                    large={4}
                    medium={6}
                    small={12}
                />
            </Suspense>
        </Wrapper>
    )
}
