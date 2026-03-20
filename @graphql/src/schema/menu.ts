import mongoose from 'mongoose'
/* T_Types */
import type { MenuItem as T_MenuItem } from '@common/types/menu'

const { Schema, model } = mongoose

/**
 * Mongoose model for a WordPress menu location
 */
const menuItemSchema = new Schema<T_MenuItem>({
    position: String,
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    target: String,
    link: String,
    parent: Number,
    order: Number,
})
menuItemSchema.index({ id: 1, position: 1 })

/**
 * Exported model `Menu` (collection name: `menus`).
 * Use this model to query or update WordPress menu
 */
export const MenuItem = model('menu-items', menuItemSchema)
