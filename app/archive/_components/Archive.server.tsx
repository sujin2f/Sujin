import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
/* Models */
import { A_Error, NoContentError } from '@common/model/Error'
/* Components */
import { CardsServer } from '@app/archive/_components/Cards.server'
import Wrapper from '@app/_components/Wrapper'
import { Loading } from '@app/archive/_components/Loading'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { ARCHIVE, T_Archive } from '@app/_lib/types'
import { revalidate } from '@app/_lib/constants'
/* Utils */
import { getCachedArchive } from '@app/archive/_lib/getCachedArchive'
import { updateHits } from '@app/archive/_lib/updateHits'
import { getCachedArchivePosts } from '@app/archive/_lib/getCachedArchivePosts'
/* T_Type */
import type { T_Stringify } from '@common/types/mongo'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    const requestArchive = unstable_cache(
        async (slug: string, type: ARCHIVE) => {
            return await getCachedArchive(slug, type).catch((e) => {
                if (e instanceof NoContentError) {
                    e.log()
                    notFound()
                }
                if (e instanceof A_Error) {
                    e.log()
                }
                throw e
            })
        },
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate,
        },
    )

    const archive = await requestArchive(slug, type)
    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        await updateHits(slug)
    }

    const requestPosts = unstable_cache(
        async (archive: T_Stringify<T_Archive>, page: number) => {
            return await getCachedArchivePosts(archive, page).catch((e) => {
                if (e instanceof NoContentError) {
                    e.log()
                    notFound()
                }
                if (e instanceof A_Error) {
                    e.log()
                }
                throw e
            })
        },
        [type, slug, page.toString(), VERSION],
        {
            tags: ['wordpress', 'archive', 'posts'],
            revalidate,
        },
    )

    return (
        <Wrapper
            className="wrapper--archive sujin"
            title={title}
            excerpt={excerpt}
            prefix={type}
            background={image}
        >
            <Suspense fallback={<Loading />}>
                <CardsServer
                    keyPrefix={`${type}-${slug}-${page}`}
                    posts={requestPosts(archive, page)}
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
