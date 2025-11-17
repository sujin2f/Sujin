import { type FormEvent, useCallback, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
/* T_Types */
import { type T_Recipe, UNITS } from '@sujin/lib/types'
/* Utils */
import { mutateRecipe } from '@lib/apollo/mutation/recipe-mutate'

const toRecipe = (
    formData: FormData,
    numFields: number,
): { recipe?: Partial<T_Recipe>; error?: string[] } => {
    const title = formData.get('title')?.toString().trim()
    if (!title) return { error: ['Title is required'] }
    const url = formData.get('url')?.toString().trim() || ''
    const recipe: Partial<T_Recipe> = {
        title,
        url,
        ingredients: [],
    }
    const detail: T_Recipe['ingredients'] = []

    Array(numFields)
        .fill('')
        .forEach((_, index) => {
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

// const useRecipeMutation = (recipe?: T_Recipe) => {
export const useRecipeMutation = () => {
    const router = useRouter()
    let session
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks -- Error from Error boundary
        session = useSession()
    } catch {}

    const email = session?.data?.user?.email
    if (!email) {
        notFound()
    }

    const [numFields, setNumFields] = useState(1)
    const [errors, setErrors] = useState<string[]>([])

    const onChange = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        if (
            formData.get(`ingredient[${numFields - 1}]`) ||
            formData.get(`amount[${numFields - 1}]`)
        ) {
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
                await mutateRecipe(validation.recipe).then((id) =>
                    router.push(`/recipe/detail/${id}`),
                )
            }
        },
        [numFields, router],
    )

    return { numFields, onChange, errors, setErrors, onSubmit }
}
