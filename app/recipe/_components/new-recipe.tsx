'use client'
import { FormEvent, useCallback, useState } from 'react'

import Button from '@common/components/forms/Button'
import Input from '@common/components/forms/Input'
import Select from '@common/components/forms/Select'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import ButtonGroup from '@common/components/forms/ButtonGroup'
import { type T_Recipe, UNITS } from '@app/_lib/types'
import { map } from '@common/utils/array'

type Props = {
    addRecipe: (recipe: Omit<T_Recipe, '_id' | 'user'>) => Promise<void>
}

export function NewRecipe({ addRecipe }: Props) {
    const [numFields, setNumFields] = useState(1)
    const [errors, setErrors] = useState<string[]>([])

    const onSubmit = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)

            const title = formData.get('title')?.toString().trim()
            if (!title) {
                setErrors(['Title is required'])
                return
            }
            const url = formData.get('url')?.toString().trim() || ''
            const recipe: Omit<T_Recipe, '_id' | 'user'> = {
                title,
                url,
                ingredients: '',
                recipe: [],
            }

            map(numFields, (_, index) => {
                const ingredient = formData
                    .get(`ingredient[${index}]`)
                    ?.toString()
                    .trim()
                const amount = formData
                    .get(`amount[${index}]`)
                    ?.toString()
                    .trim()
                const unit = formData.get(`unit[${index}]`)?.toString()

                if (ingredient && amount && unit) {
                    recipe.recipe.push({
                        title: ingredient,
                        amount: parseFloat(amount),
                        unit: unit as UNITS,
                    })

                    recipe.ingredients += ` ${ingredient} `
                }
            })

            if (!recipe.recipe.length) {
                setErrors(['', 'Ingredients are required'])
                return
            }

            await addRecipe(recipe)
        },
        [addRecipe, numFields],
    )
    return (
        <>
            <h2>input</h2>
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
                />
                <Input label="URL" type="url" name="url" />
                <fieldset>
                    <legend>Choose your favorite monster</legend>

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
                                    options={UNITS as unknown as string[]}
                                    name={`unit[${index}]`}
                                />
                            </Column>
                        </Row>
                    ))}
                </fieldset>
                <ButtonGroup>
                    <Button hollow>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </ButtonGroup>
            </form>
        </>
    )
}
