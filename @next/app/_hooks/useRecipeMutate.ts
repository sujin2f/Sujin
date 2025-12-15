import { type FormEvent, useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
/* T_Types */
import { type T_Recipe, UNITS } from '@sujin/lib/types'
/* Utils */
import { createRecipe } from '@lib/apollo/queries/recipes/createRecipe'
import { replaceRecipe } from '@lib/apollo/queries/recipes/replaceRecipe'

const toRecipe = (formData: FormData, numFields: number): { recipe?: Partial<T_Recipe>; error?: string[] } => {
    const _id = formData.get('_id')?.toString().trim()
    const title = formData.get('title')?.toString().trim()
    const url = formData.get('url')?.toString().trim() || ''
    if (!title) return { error: ['Title is required'] }

    const recipe: Partial<T_Recipe> = {
        title,
        url,
        ingredients: [],
    }
    if (_id) {
        recipe._id = _id
    }

    const detail: T_Recipe['ingredients'] = []
    Array(numFields)
        .fill('')
        .forEach((_, index) => {
            const ingredient = formData.get(`ingredient[${index}]`)?.toString().trim()
            const amount = formData.get(`amount[${index}]`)?.toString().trim()
            const unit = formData.get(`unit[${index}]`)?.toString()

            if (ingredient && amount && unit) {
                detail.push({
                    title: ingredient,
                    amount: parseFloat(amount),
                    unit: unit as UNITS,
                })
            }
        })

    if (!detail.length) return { error: ['', 'Ingredients are required'] }

    return {
        recipe: {
            ...recipe,
            ingredients: detail,
        } satisfies Partial<T_Recipe>,
    }
}

export const useRecipeCreate = (recipe?: T_Recipe) => {
    const router = useRouter()
    const [numFields, setNumFields] = useState(!recipe ? 1 : recipe.ingredients.length + 1)
    const [errors, setErrors] = useState<string[]>([])

    const onChange = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (formData.get(`ingredient[${numFields - 1}]`) || formData.get(`amount[${numFields - 1}]`)) {
            setNumFields(numFields + 1)
        }
    }

    const onSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const validation = toRecipe(formData, numFields)
            if (validation.error) {
                setErrors(validation.error)
                return
            }
            if (validation.recipe) {
                if (validation.recipe._id) {
                    await replaceRecipe(validation.recipe).then((id) => router.push(`/recipe/detail/${id}`))
                } else {
                    await createRecipe(validation.recipe).then((id) => router.push(`/recipe/detail/${id}`))
                }
            }
        },
        [numFields, router],
    )

    return { numFields, onChange, errors, setErrors, onSubmit }
}
