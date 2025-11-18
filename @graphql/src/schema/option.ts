import mongoose from 'mongoose'

const { Schema, model } = mongoose

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

export const Option = model('option', optionSchema)
