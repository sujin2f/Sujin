/* T_Types */
import { type T_Recipe, UNITS } from '@app/_lib/types'
import type { T_Stringify } from '@common/types/mongo'

export const validate = (formData: FormData, fields: unknown[]) => {
    const title = formData.get('title')?.toString().trim()
    if (!title) {
        return { error: ['Title is required'] }
    }
    const url = formData.get('url')?.toString().trim() || ''
    const recipe: Partial<T_Stringify<T_Recipe>> = {
        title,
        url,
        search: '',
        ingredients: [],
    }
    const detail: T_Recipe['ingredients'] = []

    fields.forEach((_, index) => {
        const ingredient = formData
            .get(`ingredient[${index}]`)
            ?.toString()
            .trim()
        const amount = formData.get(`amount[${index}]`)?.toString().trim()
        const unit = formData.get(`unit[${index}]`)?.toString()

        if (ingredient && amount && unit) {
            detail.push({
                title: ingredient,
                amount: parseFloat(amount),
                unit: unit as UNITS,
            })

            recipe.search += ` ${ingredient} `
        }
    })

    if (!detail.length) {
        return { error: ['', 'Ingredients are required'] }
    }

    return {
        result: {
            ...recipe,
            ingredients: detail,
        } satisfies Partial<T_Stringify<T_Recipe>>,
    }
}
