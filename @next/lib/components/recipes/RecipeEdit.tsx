'use client'
import { useRouter } from 'next/navigation'
/* Components */
import Button from '@common/components/forms/Button'
import Input from '@common/components/forms/Input'
import Select from '@common/components/forms/Select'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import ButtonGroup from '@common/components/forms/ButtonGroup'
/* T_Types */
import { T_Recipe, UNITS_SELECTION } from '@sujin/lib/types'
/* Utils */
import { map } from '@sujin/share/utils/array'
import { useRecipeCreate } from '@lib/hooks/useRecipeMutate'

type Props = {
    recipe?: T_Recipe
}

export function RecipeEdit({ recipe }: Props) {
    const router = useRouter()
    const { numFields, onChange, onSubmit, errors } = useRecipeCreate(recipe)

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
                    defaultValue={recipe?.title}
                />
                <Input label="URL" type="url" name="url" className="--gap--bottom" defaultValue={recipe?.url} />
                <Input type="hidden" name="_id" value={recipe?._id} />

                <fieldset className="--gap--bottom">
                    <legend>Ingredients</legend>

                    {errors[1] && <p className="form__input__error-message">{errors[1]}</p>}

                    {map(numFields, (_, index) => (
                        <Row key={`recipe-input-${index}`} dom="section" fullWidth>
                            <Column small={4}>
                                <Input
                                    label="Ingredient"
                                    name={`ingredient[${index}]`}
                                    defaultValue={recipe?.ingredients[index]?.title}
                                />
                            </Column>
                            <Column small={4}>
                                <Input
                                    label="Amount"
                                    type="number"
                                    step="0.01"
                                    name={`amount[${index}]`}
                                    defaultValue={recipe?.ingredients[index]?.amount}
                                />
                            </Column>
                            <Column small={4}>
                                <Select
                                    label="Unit"
                                    options={UNITS_SELECTION as unknown as Record<string, string | string[]>}
                                    name={`unit[${index}]`}
                                    defaultValue={recipe?.ingredients[index]?.unit}
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
