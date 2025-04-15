/* Models */
import Cached from '@common/model/Cached'
/* T_Types */
import type { MutationResultType } from '@app/api/graphql/constants'
/* Utils */
import { mutateArchive } from '@app/_lib/data/mongo/wordpress/archive'
import { getCacheKey } from '@app/_lib/utils'
/* CONSTANTS */
import { shuffle } from '@common/utils/array'
import { ARCHIVE, COLLECTION, T_Archive } from '@app/_lib/types'
import { IS_DEV } from '@common/constants/helper'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { getCollection } from '@common/data/mongo/mongo'

export const mutateTag = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> => await mutateArchive(nonce, slug, ARCHIVE.TAG)

export const updateHits = async (slug: string) => {
    const collection = await getCollection(COLLECTION.ARCHIVE)
    await collection.updateOne(
        { slug, type: ARCHIVE.TAG },
        { $inc: { hits: 1 } },
    )
}

export const getTagCloud = async (): Promise<T_Archive[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(COLLECTION.ARCHIVE, 'tag-cloud'),
        async () => {
            const tags: Record<string, T_Archive> = {}
            const collection = await getCollection<T_Archive>(
                COLLECTION.ARCHIVE,
            )

            await collection
                .find({
                    total: { $not: { $eq: 0 } },
                    type: ARCHIVE.TAG,
                })
                .sort({ total: -1 })
                .limit(20)
                .toArray()
                .then((result) => {
                    const step = result.length / 5
                    result.forEach((tag, index) => {
                        tags[tag.slug] = {
                            ...tag,
                            hits: Math.floor(index / step),
                        }
                    })
                })

            await collection
                .find({
                    total: { $not: { $eq: 0 } },
                    type: ARCHIVE.TAG,
                })
                .sort({ hits: -1 })
                .limit(20)
                .toArray()
                .then((result) => {
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
        DAY_IN_SECONDS,
        IS_DEV,
    )
