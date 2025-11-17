import { Types } from 'mongoose'
import { Recipe } from '@src/schema/recipe'
import { Context } from '@src/types'
import type { T_Recipe } from '@sujin/lib/types'
import { verifyToken } from '@src/utils/mongo/verifyUser'

export const recipe = async (_id: string): Promise<T_Recipe> => {
    const recipe = Recipe.findById(_id)
    console.log(recipe)
    return {} as T_Recipe
}

export const mutateRecipe = async (
    data: T_Recipe,
    context: Context,
): Promise<string> => {
    // Verify Token
    const user = await verifyToken(context.token)
    console.log(user)
    if (!user._id) {
        throw new Error()
    }

    // Modify
    // if (data._id) {
    //     if (user._id !== data.user) {
    //         throw new Error()
    //     }

    //     // Verify email matches
    //     const recipe = (await Recipe.findById(data._id))?.toObject()
    //     if (!recipe) {
    //         throw new Error()
    //     }

    //     if (recipe.user?.toString() !== data.user) {
    //         throw new Error()
    //     }

    //     await Recipe.replaceOne({ _id: new Types.ObjectId(data._id) }, { data })
    //     return recipe._id.toString()
    // }

    const search = new Set([
        data.title,
        ...data.ingredients.map((item) => item.title),
    ])
    const insert = {
        ...data,
        user: user._id,
        search: Array.from(search).join(' '),
    }
    console.log(insert)

    const result = await Recipe.insertOne(insert)
    console.log(result)
    // return result._id.toString()
    console.log(data, context)
    return 'yes'
}
