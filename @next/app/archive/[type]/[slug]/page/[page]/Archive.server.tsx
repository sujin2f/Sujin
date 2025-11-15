import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { Cards } from '@lib/components/archive/Cards.use'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
/* Utils */
import { getArchivePosts } from '@lib/apollo/query/getArchivePosts'
import { getArchive } from '@lib/apollo/query/getArchive'
import { updateHits } from '@lib/apollo/mutation/updateHits'

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
                    posts={getArchivePosts({
                        id: archive._id,
                        page,
                        fields: 'POST_ARCHIVE',
                    }).catch(() => {
                        return { archivePosts: [], numPages: 1 }
                    })}
                    listKey="archivePosts"
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
