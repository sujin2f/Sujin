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
    machineId: {
        type: String,
        required: true,
    },
    type: {
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

/**
 * Mongoose model for a Focus browser.
 */
const focusBrowserSchema = new Schema<{ user: typeof SchemaTypes.ObjectId; device: string; machineId?: string }>({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
        required: true,
    },
    device: {
        type: String,
        required: true,
    },
    machineId: {
        type: String,
        required: true,
    },
})
focusBrowserSchema.index({ user: 1, device: 1 })

/**
 * Exported model `Focus` (collection name: `focus`).
 */
export const FocusBrowser = model('focus-browser', focusBrowserSchema)

// /**
//  * Mongoose model for a Focus browser bookmark.
//  */
// const focusBookmarkSchema = new Schema({
//     user: {
//         type: SchemaTypes.ObjectId,
//         ref: 'user',
//         required: true,
//     },
//     key: {
//         type: String,
//         required: true,
//     },
//     title: {
//         type: String,
//         required: true,
//     },
//     device: {
//         type: String,
//         required: true,
//     },
//     machineId: {
//         type: String,
//         required: true,
//     },
//     type: {
//         type: String,
//         enum: ['bookmark', 'keystroke'],
//         required: true,
//     },
//     message: {
//         type: String,
//         required: true,
//     },
//     expires: {
//         type: Number,
//         required: true,
//     },
// })
// focusSchema.index({ user: 1, key: 1 })

// /**
//  * Exported model `Focus` (collection name: `focus`).
//  */
// export const Focus = model('focus', focusSchema)
