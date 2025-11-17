import mongoose from 'mongoose'
import { UNITS } from '@sujin/lib/types'
import { COLLECTION } from '@sujin/lib/constants'

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
    created: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'user',
    },
})
recipeSchema.index({ search: 'text' })

export const Recipe = model('recipe', recipeSchema, COLLECTION.RECIPE)
