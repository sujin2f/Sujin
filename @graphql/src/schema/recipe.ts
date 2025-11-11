import mongoose from 'mongoose'
import { UNITS } from '@sujin/lib/types'

const { Schema, SchemaTypes, model } = mongoose

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    url: String,
    search: String,
    ingredients: [
        {
            title: String,
            amount: Number,
            unit: {
                type: String,
                enum: UNITS as unknown as string[],
            },
        },
    ],
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
    },
})
recipeSchema.index({ search: 'text' })

export const Recipe = model('recipe', recipeSchema)
