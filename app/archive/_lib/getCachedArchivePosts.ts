'use server'
import sanitize from 'mongo-sanitize'
/* Utils */
import { cachedRequest } from '@app/_lib/utils/cache'
import { getArchivePosts } from '@app/archive/_lib/getArchivePosts'
/* CONSTANTS */
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
import {
    COLLECTION,
    POST_STATUS,
    type T_ArchivePost,
    type T_Archive,
    type PropWithPages,
} from '@app/_lib/types'
import type { T_Mongo } from '@common/types/mongo'

export const getCachedArchivePosts = async (
    archive: T_Mongo<T_Archive>,
    _page: number,
): Promise<PropWithPages<T_ArchivePost>> => {
    const page = sanitize(_page)
    let error: Error | null = null
    const posts = await cachedRequest(
        COLLECTION.ARCHIVE,
        [archive.type, archive.slug, page],
        async () => {
            const list: false | T_ArchivePost[] = await getArchivePosts(
                archive._id,
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
