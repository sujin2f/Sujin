import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards.use'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
/* Utils */
import { updateHits, getArchive } from '@lib/apollo/archives'
import { getPosts } from '@lib/apollo/single'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    const archive = await getArchive(slug, type, 'ARCHIVE').catch(() => {
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
                    posts={getPosts(archive._id, page, 'POST_ARCHIVE').catch(
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
