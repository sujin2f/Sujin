import mongoose from 'mongoose'
/* Models */
import { Images } from '@src/schema/images'
/* CONSTANTS */
import { POST_STATUS } from '@sujin/lib/constants'

const { Schema, SchemaTypes, model } = mongoose

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
        useBackgroundColor: Boolean,
        backgroundColor: String,
    },
    content: {
        type: String,
        required: true,
    },
}

const postSchema = new Schema({
    ...commonSchema,
    archives: [
        {
            type: SchemaTypes.ObjectId,
            ref: 'archive',
        },
    ],
})

postSchema.index({ content: 'text' })
postSchema.index({ slug: 1 })
postSchema.index({ date: 1 })

const pageSchema = new Schema(commonSchema)
pageSchema.index({ slug: 1 })

export const Page = model('page', pageSchema)
export const Post = model('post', postSchema)
