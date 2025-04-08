/// @todo 태그가 카테고리에 들어감

/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
/* Types */
import type { TagType } from '@app/_lib/data/mysql/types'
import type { MutationResultType } from '@app/api/graphql/constants'
/* Utils */
import {
    getCachedArchive,
    updateArchive,
    mutateArchive,
    getArchives,
    removeArchive,
    categoryFormatter,
} from '@app/_lib/data/mongo/wordpress/archive'
import { getCacheKey } from '@app/_lib/utils'
/* CONSTANTS */
// import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { shuffle } from '@common/utils/array'
import { ARCHIVE } from '@app/_lib/types'

export const formatter = (term: Record<string, unknown>): TagType => {
    const formatted = {
        ...categoryFormatter(term),
        hits: 0,
    } as TagType

    if ('hits' in term) {
        formatted.hits = term.hits as number
    }

    return formatted
}

export const getCachedTag = async (slug: string): Promise<TagType> =>
    await getCachedArchive(slug, ARCHIVE.TAG, formatter)

export const updateTag = async (slug: string): Promise<TagType> =>
    await updateArchive(slug, ARCHIVE.TAG, formatter)

export const mutateTag = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> =>
    await mutateArchive(nonce, slug, ARCHIVE.TAG, formatter)

export const getTags = async (page: number = 1): Promise<TagType[]> =>
    await getArchives(page, ARCHIVE.TAG, formatter)

export const removeTag = async (slug: string) =>
    await removeArchive(slug, ARCHIVE.TAG)

export const updateHits = async (slug: string) =>
    await Mongo.updateOne(ARCHIVE.TAG, { slug }, { $inc: { hits: 1 } })

export const getTagCloud = async (): Promise<TagType[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(ARCHIVE.TAG, 'tag-cloud'),
        async () => {
            const tags: Record<string, TagType> = {}
            await Mongo.findMany<TagType>(
                ARCHIVE.TAG,
                {},
                { sort: { total: -1 }, limit: 20 },
            ).then((result) => {
                const step = result.length / 5
                result.forEach((tag, index) => {
                    tags[tag.slug] = {
                        ...tag,
                        hits: Math.floor(index / step),
                    }
                })
            })
            await Mongo.findMany<TagType>(
                ARCHIVE.TAG,
                {},
                { sort: { hits: -1 }, limit: 20 },
            ).then((result) => {
                const step = result.length / 5
                result.forEach((tag, index) => {
                    if (tags[tag.slug]) {
                        tags[tag.slug] = {
                            ...tag,
                            total: Math.floor(index / step),
                            hits: tags[tag.slug].hits,
                        }
                    } else {
                        tags[tag.slug] = {
                            ...tag,
                            total: Math.floor(index / step),
                        }
                    }
                })
            })
            return shuffle(Object.values(tags))
        },
        0,
    )
