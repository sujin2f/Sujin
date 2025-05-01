import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
/* Models */
import { A_Error, NoContentError } from '@common/model/Error'
/* Components */
import { Cards } from '@app/archive/_components/Cards'
import Wrapper from '@app/_components/Wrapper'
import { Loading } from '@app/archive/_components/Loading'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import {
    ARCHIVE,
    COLLECTION,
    POST_STATUS,
    type T_ArchivePost,
    type T_Archive,
    type PropWithPages,
} from '@app/_lib/types'
/* Utils */
import { getCachedArchive } from '@app/archive/_lib/getCachedArchive'
import { updateHits } from '@app/archive/_lib/updateHits'
import { cachedRequest } from '@app/_lib/utils/cache'
import { getArchivePosts } from '@app/archive/_lib/getArchivePosts'
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
                <Cards
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

const getCachedArchivePosts = async (
    archive: T_Stringify<T_Archive>,
    _page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const page = sanitize(_page)
    let error: Error | null = null
    const posts = await cachedRequest(
        COLLECTION.ARCHIVE,
        [archive.type, archive.slug, page],
        async () => {
            const list: false | T_ArchivePost[] = await getArchivePosts(
                new ObjectId(archive._id),
                page,
                POST_STATUS.PUBLISH,
            ).catch((e) => {
                // Failed to find the post, cache false
                error = e
                return false
            })
            if (!list) {
                return false
            }
            return {
                list,
                pages: Math.ceil(archive.total / PER_PAGE),
            } satisfies PropWithPages<T_ArchivePost>
        },
    )
    if (error) {
        throw error
    }
    return posts as PropWithPages<T_ArchivePost>
}
