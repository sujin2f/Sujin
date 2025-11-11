import mongoose from 'mongoose'
import { ImageBlock } from '@src/schema/image-block'

const { Schema, model } = mongoose

export const BackgroundSchema = new Schema({
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

export const Background = model('background', BackgroundSchema)
