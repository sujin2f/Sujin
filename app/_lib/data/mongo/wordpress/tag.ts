/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
/* Types */
import { ARCHIVE, type ArchiveType } from '@app/_lib/types/wordpress'
import type { MutationResultType } from '@app/api/graphql/constants'
/* Utils */
import {
    getCachedArchive,
    updateArchiveTotal,
    updateArchive,
    secureUpdateArchive,
    getArchives,
    removeArchive,
} from '@app/_lib/data/mongo/wordpress/archive'
import { getCacheKey } from '@app/_lib/utils/system'
/* Constants */
import { COLLECTION } from '@app/_lib/data/mongo/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { shuffle } from '@common/utils/array'

export const getCachedTag = async (
    slug: string,
    updateFromMySQL: boolean = false,
): Promise<ArchiveType> =>
    await getCachedArchive(slug, ARCHIVE.TAG, updateFromMySQL)

export const updateTagTotal = async (slug: string): Promise<ArchiveType> =>
    await updateArchiveTotal(slug, ARCHIVE.TAG)

export const updateTag = async (slug: string): Promise<ArchiveType> =>
    await updateArchive(slug, ARCHIVE.TAG)

export const secureUpdateTag = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> =>
    await secureUpdateArchive(nonce, slug, ARCHIVE.TAG)

export const getTags = async (page: number = 1) =>
    await getArchives(page, ARCHIVE.TAG)

export const removeTag = async (slug: string) =>
    await removeArchive(slug, ARCHIVE.TAG)

export const updateHits = async (slug: string) => {
    await getCachedTag(slug, true)
        .then(async (tag) => {
            if (tag.total === 0) {
                await updateTagTotal(tag.slug)
            }

            await Mongo.replaceOne(
                COLLECTION.TAG,
                { slug },
                { ...tag, hits: tag.hits + 1 },
            )
        })
        .catch(() => {
            // do nothing
        })
}

export const getTagCloud = async (): Promise<ArchiveType[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.TAG, 'tag-cloud'),
        async () => {
            const tags: Record<string, ArchiveType> = {}
            await Mongo.findMany<ArchiveType>(
                COLLECTION.TAG,
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
            await Mongo.findMany<ArchiveType>(
                COLLECTION.TAG,
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
        WEEK_IN_SECONDS,
    )
