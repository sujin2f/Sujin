import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards.use'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import ARCHIVE_QUERY from '@lib/constants/gql/archive.graphql'
import POST_LIST_QUERY from '@lib/constants/gql/post.list.graphql'
/* Utils */
import { updateHits } from '@lib/apollo/mutation/updateHits'
import { cachedGQLRequest } from '@lib/apollo/GQLRequest'
/* T_Types */
import type { PropWithPages, T_Post, T_Archive } from '@sujin/lib/types'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    const archive = await cachedGQLRequest<{ archive: T_Archive[] }>(
        ARCHIVE_QUERY,
        { slug, type },
        [COLLECTION.ARCHIVE, type, slug],
    )
        .then((result) => {
            if (!result.data || !result.data.archive.length) {
                notFound()
            }
            return result.data.archive[0]
        })
        .catch(() => notFound())

    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        await updateHits(slug)
    }

    const posts = cachedGQLRequest<PropWithPages<T_Post, 'post'>>(
        POST_LIST_QUERY,
        { page, category: slug },
        [COLLECTION.ARCHIVE, 'posts', type, slug, page.toString()],
    )
        .then((result) => {
            if (!result.data) {
                return {
                    post: [],
                    numPages: 1,
                }
            }
            return result.data
        })
        .catch(() => ({
            post: [],
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
                    listKey="post"
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
