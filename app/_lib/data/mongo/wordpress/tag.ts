/* Models */
import Mongo from '@common/data/mongo/mongo'
import Cached from '@common/model/Cached'
/* T_Types */
import type { MutationResultType } from '@app/api/graphql/constants'
/* Utils */
import {
    updateArchive,
    mutateArchive,
    getArchives,
    removeArchive,
} from '@app/_lib/data/mongo/wordpress/archive'
import { getCacheKey } from '@app/_lib/utils'
import { schemaFormatter } from '@common/utils/object'
/* CONSTANTS */
import { default as schema } from '@app/_lib/data/mongo/schema/10.3.2'
import { shuffle } from '@common/utils/array'
import { ARCHIVE, T_Tag } from '@app/_lib/types'
import { IS_DEV } from '@common/constants/helper'
import { DAY_IN_SECONDS } from '@common/constants/datetime'

const formatter = (term: Record<string, unknown>): T_Tag =>
    schemaFormatter(
        {
            ...term,
            hits: term.hits || 0,
        },
        schema.tag,
    ) as T_Tag

export const updateTag = async (slug: string): Promise<T_Tag> =>
    await updateArchive(slug, ARCHIVE.TAG, formatter)

export const mutateTag = async (
    nonce: string,
    slug: string,
): Promise<MutationResultType> =>
    await mutateArchive(nonce, slug, ARCHIVE.TAG, formatter)

export const getTags = async (page: number = 1): Promise<T_Tag[]> =>
    await getArchives<T_Tag>(page, ARCHIVE.TAG)

export const removeTag = async (slug: string) =>
    await removeArchive(slug, ARCHIVE.TAG)

export const updateHits = async (slug: string) =>
    await Mongo.updateOne(ARCHIVE.TAG, { slug }, { $inc: { hits: 1 } })

export const getTagCloud = async (): Promise<T_Tag[]> =>
    await Cached.getInstance().getOrExecute(
        getCacheKey(ARCHIVE.TAG, 'tag-cloud'),
        async () => {
            const tags: Record<string, T_Tag> = {}
            await Mongo.findMany<T_Tag>(
                ARCHIVE.TAG,
                { total: { $not: { $eq: 0 } } },
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
            await Mongo.findMany<T_Tag>(
                ARCHIVE.TAG,
                { total: { $not: { $eq: 0 } } },
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
        DAY_IN_SECONDS,
        IS_DEV,
    )
