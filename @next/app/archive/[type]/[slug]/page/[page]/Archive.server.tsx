import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards.use'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE, IMAGE_SIZE } from '@sujin/lib/types'
import { ARCHIVE_POSTS, IMAGE } from '@lib/constants/graphql-fields'
/* Utils */
import { updateHits, getArchive } from '@lib/apollo/archives'
import { getPosts } from '@lib/apollo/single'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

const archiveFields = `_id title excerpt
    image {
        ${IMAGE}
        sizes {
            ${IMAGE_SIZE.MEDIUM} { ${IMAGE} }
            ${IMAGE_SIZE.MEDIUM_LARGE} { ${IMAGE} }
            ${IMAGE_SIZE.LARGE} { ${IMAGE} }
        }
    }
`

export async function ArchiveServer({ type, slug, page }: Props) {
    const archive = await getArchive(slug, type, archiveFields).catch(() => {
        notFound()
    })

    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        await updateHits(slug)
    }

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
                    posts={getPosts(archive._id, page, ARCHIVE_POSTS).catch(
                        () => {
                            return { list: [], pages: 1 }
                        },
                    )}
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
