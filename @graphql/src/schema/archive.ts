import mongoose from 'mongoose'
import { ARCHIVE } from '@sujin/lib/constants'
import { ImageBlock } from '@src/schema/image-block'

const { Schema, model } = mongoose

/**
 * Mongoose model for a WordPress archive (category or tag).
 *
 * Fields:
 * - `title`: human-readable title of the archive.
 * - `slug`: URL-friendly slug (indexed).
 * - `excerpt`: short excerpt or description.
 * - `image`: optional `ImageBlock` used as a thumbnail.
 * - `type`: one of `ARCHIVE.CATEGORY` or `ARCHIVE.TAG` (indexed).
 * - `total`: numeric total (posts count) for ranking or display.
 * - `hits`: numeric hits counter used for recency/popularity.
 */
const archiveSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        index: true,
        required: true,
    },
    excerpt: String,
    image: ImageBlock,
    type: {
        type: String,
        enum: [ARCHIVE.CATEGORY, ARCHIVE.TAG],
        index: true,
        required: true,
    },
    total: Number,
    hits: Number,
})
archiveSchema.index({ slug: 1, type: 1 })

/**
 * Exported model `Archive` (collection name: `archive`).
 * Use this model to query or update WordPress archive documents.
 */
export const Archive = model('archive', archiveSchema)
