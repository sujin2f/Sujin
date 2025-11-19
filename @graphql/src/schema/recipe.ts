import mongoose from 'mongoose'
import { UNITS } from '@sujin/lib/types'
import { COLLECTION } from '@sujin/lib/constants'

const { Schema, SchemaTypes, model } = mongoose

/**
 * Recipe schema stores user-submitted recipes with ingredient lists.
 *
 * Fields:
 * - `title`: recipe title (required)
 * - `url`: optional original source URL
 * - `search`: text index field used for searching recipes
 * - `ingredients`: array of ingredient items with amount and unit
 * - `created`: creation timestamp
 * - `user`: reference to the `user` who submitted the recipe
 */
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

/**
 * Exported model `Recipe` stored under the collection name defined in
 * `COLLECTION.RECIPE`.
 */
export const Recipe = model('recipe', recipeSchema, COLLECTION.RECIPE)
