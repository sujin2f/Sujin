import mongoose from 'mongoose'
import { ImageBlock } from '@src/schema/image-block'

const { Schema, model } = mongoose

const backgroundSchema = new Schema({
    ...ImageBlock,
    mimeType: {
        ...ImageBlock.mimeType,
        required: true,
    },
    url: {
        ...ImageBlock.url,
        required: true,
        index: true,
        unique: true,
    },
})
backgroundSchema.index({ url: 1 })

export const Background = model('background', backgroundSchema)
