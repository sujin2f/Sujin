import mongoose from 'mongoose'

const { Schema, model } = mongoose

const usersSchema = new Schema({
    email: {
        type: Buffer,
        index: true,
        required: true,
        unique: true,
    },
    name: Buffer,
    image: String,
})

export const User = model('user', usersSchema)
