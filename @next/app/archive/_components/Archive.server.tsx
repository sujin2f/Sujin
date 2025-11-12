import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { ObjectId } from 'mongodb'
/* Models */
import { A_Error, NoContentError } from '@sujin/common/model/Error'
/* Components */
import { Cards } from '@app/archive/_components/Cards.use'
import Wrapper from '@app/_components/Wrapper'
import { Loading } from '@app/archive/_components/Loading'
/* CONSTANTS */
import { VERSION } from '@sujin/common/constants/helper'
import { revalidate } from '@app/_lib/constants'
import { PER_PAGE } from '@app/_lib/constants'
import {
    ARCHIVE,
    COLLECTION,
    POST_STATUS,
    type T_ArchivePost,
    type T_Archive,
    type PropWithPages,
} from '@app/_lib/types'
/* Utils */
import { getCachedArchive } from '@app/_lib/utils/mongo/getCachedArchive'
import { updateHits } from '@app/_lib/utils/mongo/updateHits'
import { cachedRequest, getCacheKey } from '@app/_lib/utils/cache'
import { getArchivePosts } from '@app/_lib/utils/mongo/getArchivePosts'

type Props = {
    type: ARCHIVE
    slug: string
    page: number
}

export async function ArchiveServer({ type, slug, page }: Props) {
    const archive = await getCachedArchive(slug, type).catch((e) => {
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
            <Suspense fallback={<Loading />}>
                <Cards
                    keyPrefix={`${type}-${slug}-${page}`}
                    posts={requestPosts(archive, page, type, slug).catch(
                        (e) => {
                            if (e instanceof NoContentError) {
                                e.log()
                                notFound()
                            }
                            if (e instanceof A_Error) {
                                e.log()
                            }
                            throw e
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

const requestPosts = async (
    archive: T_Archive,
    page: number,
    type: ARCHIVE,
    slug: string,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = unstable_cache(
        cachedPosts,
        [type, slug, page.toString(), VERSION],
        {
            tags: ['wordpress', 'archive', 'posts'],
            revalidate,
        },
    )
    return await request(archive, page)
}

const cachedPosts = async (
    archive: T_Archive,
    page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const request = cachedRequest(
        queryPosts,
        getCacheKey(COLLECTION.ARCHIVE, archive.type, archive.slug, page),
    )
    return await request(archive, page)
}

const queryPosts = async (
    archive: T_Archive,
    page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const list: T_ArchivePost[] = await getArchivePosts(
        new ObjectId(archive._id),
        page,
        POST_STATUS.PUBLISH,
    )

    return {
        list,
        pages: Math.ceil(archive.total / PER_PAGE),
    }
}
