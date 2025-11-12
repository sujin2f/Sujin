import { Suspense } from 'react'
import { notFound } from 'next/navigation'
/* Models */
import { A_Error, NoContentError } from '@sujin/share/model/Error'
/* Components */
import { Cards } from '@app/archive/_components/Cards.use'
import Wrapper from '@lib/components/Wrapper'
import { LoadingArchive } from '@lib/components/LoadingArchive'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
/* Utils */
import { updateHits } from '@lib/apollo/archives'
import { getArchive } from '@lib/apollo/archives'
import { getPosts } from '@lib/apollo/single'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    const archive = await getArchive(slug, type).catch((e) => {
        if (e instanceof NoContentError) {
            e.log()
            notFound()
        }
        if (e instanceof A_Error) {
            e.log()
        }
        throw e
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
                    posts={getPosts(archive._id, page).catch((e) => {
                        if (e instanceof NoContentError) {
                            e.log()
                            notFound()
                        }
                        if (e instanceof A_Error) {
                            e.log()
                        }
                        throw e
                    })}
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
