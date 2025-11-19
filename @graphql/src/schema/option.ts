import mongoose from 'mongoose'

const { Schema, model } = mongoose

/**
 * Simple key/value option storage used for site configuration.
 *
 * - `key` is a unique indexed identifier for the option.
 * - `value` stores the string value associated with the key.
 */
const optionSchema = new Schema({
    key: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
    value: {
        type: String,
        required: true,
    },
})
optionSchema.index({ key: 1 })

/**
 * Exported model `Option` (collection name: `option`).
 * Use this model to read and update site-level options.
 */
export const Option = model('option', optionSchema)
