'use client'
import { type FormEvent, useCallback, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
/* Components */
import Button from '@common/components/forms/Button'
import Input from '@common/components/forms/Input'
import Select from '@common/components/forms/Select'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import ButtonGroup from '@common/components/forms/ButtonGroup'
/* T_Types */
import { type T_Recipe, UNITS, UNITS_SELECTION } from '@sujin/lib/types'
// import type { T_Stringify } from '@sujin/common/types/mongo'
/* Utils */
import { map } from '@sujin/share/utils/array'
import { useSession } from 'next-auth/react'
import { mutateRecipe } from '@lib/apollo/mutation/mutateRecipe'

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
const useRecipeMutation = () => {
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
                await mutateRecipe(validation.recipe)
            }
        },
        [numFields],
    )

    return { numFields, onChange, errors, setErrors, onSubmit }
}

export default function RecipeAddPage() {
    const router = useRouter()
    const { numFields, onChange, onSubmit, errors } = useRecipeMutation()

    return (
        <>
            <form
                onSubmit={(e) => {
                    onSubmit(e)
                    e.preventDefault()
                }}
                onChange={onChange}
            >
                <Input
                    label="Title"
                    name="title"
                    required
                    errorMessage={errors[0]}
                    className="--gap--bottom"
                />
                <Input
                    label="URL"
                    type="url"
                    name="url"
                    className="--gap--bottom"
                />
                <fieldset className="--gap--bottom">
                    <legend>Ingredients</legend>

                    {errors[1] && (
                        <p className="form__input__error-message">
                            {errors[1]}
                        </p>
                    )}

                    {map(numFields, (_, index) => (
                        <Row
                            key={`recipe-input-${index}`}
                            dom="section"
                            fullWidth
                        >
                            <Column small={4}>
                                <Input
                                    label="Ingredient"
                                    name={`ingredient[${index}]`}
                                />
                            </Column>
                            <Column small={4}>
                                <Input
                                    label="Amount"
                                    type="number"
                                    step="0.01"
                                    name={`amount[${index}]`}
                                />
                            </Column>
                            <Column small={4}>
                                <Select
                                    label="Unit"
                                    options={
                                        UNITS_SELECTION as unknown as Record<
                                            string,
                                            string | string[]
                                        >
                                    }
                                    name={`unit[${index}]`}
                                />
                            </Column>
                        </Row>
                    ))}
                </fieldset>
                <ButtonGroup className="--gap--bottom">
                    <Button hollow onClick={() => router.back()} type="button">
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </ButtonGroup>
            </form>
        </>
    )
}
