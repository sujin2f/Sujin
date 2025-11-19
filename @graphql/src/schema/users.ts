import mongoose from 'mongoose'

const { Schema, model } = mongoose

/**
 * Simple user schema used to store authenticated users by email.
 *
 * Only `email` is currently stored; the field is unique and indexed.
 */
const usersSchema = new Schema({
    email: {
        type: String,
        index: true,
        required: true,
        unique: true,
    },
})
usersSchema.index({ email: 1 })

/**
 * Exported model `User` (collection name: `user`).
 */
export const User = model('user', usersSchema)
