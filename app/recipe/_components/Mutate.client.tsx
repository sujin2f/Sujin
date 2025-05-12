'use client'
import { type FormEvent, useCallback, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
/* Components */
import Button from '@common/components/forms/Button'
import Input from '@common/components/forms/Input'
import Select from '@common/components/forms/Select'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import ButtonGroup from '@common/components/forms/ButtonGroup'
/* T_Types */
import {
    type T_Recipe,
    type T_SessionUser,
    UNITS,
    UNITS_SELECTION,
} from '@app/_lib/types'
import type { T_Stringify } from '@common/types/mongo'
/* Utils */
import { map } from '@common/utils/array'

type Props = {
    mutate: (recipe: Partial<T_Stringify<T_Recipe>>) => Promise<string>
    recipe?: T_Stringify<T_Recipe> | undefined
    user: T_SessionUser
}

export function MutateClient({ mutate, recipe, user }: Props) {
    const router = useRouter()
    const [numFields, setNumFields] = useState(
        (recipe?.ingredients.length || 0) + 1,
    )
    const [errors, setErrors] = useState<string[]>([])

    const onSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const validation = validate(formData, Array(numFields).fill(''))
            if (validation.error) {
                setErrors(validation.error)
                return
            }
            const result = {
                ...validation.result,
                user: user._id,
            }
            if (recipe?._id) {
                result._id = recipe._id
            }
            await mutate(result).then((id) => {
                redirect(`/recipe/item/${id}`)
            })
        },
        [mutate, numFields, recipe?._id, user._id],
    )

    return (
        <>
            <form
                onSubmit={(e) => {
                    onSubmit(e)
                }}
                onChange={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    if (
                        formData.get(`ingredient[${numFields - 1}]`) ||
                        formData.get(`amount[${numFields - 1}]`)
                    ) {
                        setNumFields(numFields + 1)
                    }
                }}
            >
                <Input
                    label="Title"
                    name="title"
                    required
                    errorMessage={errors[0]}
                    defaultValue={recipe?.title}
                    className="--gap--bottom"
                />
                <Input
                    label="URL"
                    type="url"
                    name="url"
                    defaultValue={recipe?.url}
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
                                    defaultValue={
                                        recipe?.ingredients[index]?.title
                                    }
                                />
                            </Column>
                            <Column small={4}>
                                <Input
                                    label="Amount"
                                    type="number"
                                    step="0.01"
                                    name={`amount[${index}]`}
                                    defaultValue={
                                        recipe?.ingredients[index]?.amount
                                    }
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
                                    defaultValue={
                                        recipe?.ingredients[index]
                                            ?.unit as string
                                    }
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

const validate = (formData: FormData, fields: unknown[]) => {
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
