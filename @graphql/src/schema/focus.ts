import mongoose from 'mongoose'

const { Schema, SchemaTypes, model } = mongoose

/**
 * Mongoose model for a Focus browser messaging.
 */
const focusSchema = new Schema({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    device: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        enum: ['bookmark', 'keystroke'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    expires: {
        type: Number,
        required: true,
    },
})
focusSchema.index({ user: 1, key: 1 })

/**
 * Exported model `Focus` (collection name: `focus`).
 */
export const Focus = model('focus', focusSchema)
