import mongoose from 'mongoose'
import { ARCHIVE } from '@sujin/lib/constants'
import { ImageBlock } from '@src/schema/image-block'

const { Schema, model } = mongoose

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

export const Archive = model('archive', archiveSchema)
