import mongoose from 'mongoose'
import { ImageBlock } from '@src/schema/image-block'

const { Schema, model } = mongoose

/**
 * Mongoose model for Backgrounds derived from `ImageBlock` with stricter
 * requirements. Backgrounds must include a `mimeType` and `url`, and the
 * `url` is unique and indexed.
 */
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

/**
 * Exported model `Background` (collection name: `background`).
 * Use this to store site background images with unique URLs.
 */
export const Background = model('background', backgroundSchema)
