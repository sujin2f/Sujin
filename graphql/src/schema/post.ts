import mongoose from 'mongoose'
import { Images } from '@src/schema/images'
import { POST_STATUS } from '@lib/types'

const { Schema, SchemaTypes, model } = mongoose

const PageSchema = {
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
    date: { type: Date, required: true },
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

const PostSchema = new Schema({
    ...PageSchema,
    archives: [
        {
            type: SchemaTypes.ObjectId,
            ref: 'archive',
        },
    ],
})

PostSchema.index({ content: 'text' })

export const Page = model('page', new Schema(PageSchema))
export const Post = model('post', PostSchema)
