'use client'
import { useRouter } from 'next/navigation'
/* Components */
import Button from '@common-old/components/forms/Button'
import Input from '@common-old/components/forms/Input'
import Select from '@common-old/components/forms/Select'
import Row from '@common-old/components/layout/Row'
import Column from '@common-old/components/layout/Column'
import ButtonGroup from '@common-old/components/forms/ButtonGroup'
/* T_Types */
import { T_Recipe, UNITS_SELECTION } from '@common/types'
/* Utils */
import { map } from '@common/utils/array'
import { useRecipeCreate } from '@app/_lib/hooks/useRecipeMutate'

type Props = {
    recipe: T_Recipe
}

export default function RecipeEditClient({ recipe }: Props) {
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
                    defaultValue={recipe.title}
                    className="--gap--bottom"
                />
                <Input label="URL" type="url" name="url" defaultValue={recipe.url} className="--gap--bottom" />
                <fieldset className="--gap--bottom">
                    <legend>Ingredients</legend>

                    {errors[1] && <p className="form__input__error-message">{errors[1]}</p>}

                    {map(numFields, (_, index) => (
                        <Row key={`recipe-input-${index}`} dom="section" fullWidth>
                            <Column small={4}>
                                <Input label="Ingredient" name={`ingredient[${index}]`} />
                            </Column>
                            <Column small={4}>
                                <Input label="Amount" type="number" step="0.01" name={`amount[${index}]`} />
                            </Column>
                            <Column small={4}>
                                <Select
                                    label="Unit"
                                    options={UNITS_SELECTION as unknown as Record<string, string | string[]>}
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
