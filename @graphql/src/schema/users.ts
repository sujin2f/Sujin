import mongoose from 'mongoose'

const { Schema, model } = mongoose

const usersSchema = new Schema({
    email: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
})
usersSchema.index({ email: 1 })

export const User = model('user', usersSchema)
