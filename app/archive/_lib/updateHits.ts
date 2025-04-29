'use server'
import sanitize from 'mongo-sanitize'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@app/_lib/types'
import { updateOne } from '@common/data/mongo/mongo'

export const updateHits = async (_slug: string) => {
    const slug = sanitize(_slug)
    await updateOne(
        COLLECTION.ARCHIVE,
        { slug, type: ARCHIVE.TAG },
        { $inc: { hits: 1 } },
    )
}
