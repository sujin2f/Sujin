import mongoose from 'mongoose'
/* Models */
import { Images } from '@src/schema/images'
/* CONSTANTS */
import { POST_STATUS } from '@sujin/lib/constants'

const { Schema, SchemaTypes, model } = mongoose

/**
 * Common fields shared by posts and pages.
 */
const commonSchema = {
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    excerpt: String,
    date: { type: Number, required: true },
    images: Images,
    status: {
        type: String,
        enum: [...Object.values(POST_STATUS)],
        required: true,
    },
    meta: {
        backgroundColor: String,
    },
    content: {
        type: String,
        required: true,
    },
}

/**
 * Post schema extends the common fields and references `Archive` documents.
 */
const postSchema = new Schema({
    ...commonSchema,
    archives: [
        {
            type: SchemaTypes.ObjectId,
            ref: 'archive',
        },
    ],
})

postSchema.index({ content: 'text', title: 'text' })
postSchema.index({ slug: 1 })
postSchema.index({ date: 1 })

/**
 * Page schema reuses the common fields but is stored in the `page` collection.
 */
const pageSchema = new Schema(commonSchema)
pageSchema.index({ slug: 1 })

/**
 * Exported models: `Page` and `Post`.
 */
export const Page = model('page', pageSchema)
export const Post = model('post', postSchema)
