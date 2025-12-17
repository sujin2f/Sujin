'use client'
import { useRouter } from 'next/navigation'
/* T_Types */
import { T_Recipe, UNITS_SELECTION } from '@sujin/lib/types'
/* Utils */
import { map } from '@sujin/share/utils/array'
import { useRecipeCreate } from '@app/_hooks/useRecipeMutate'
/* Components */
import { Input } from '@app/_components/html-elements/Input'
import { Select } from '@app/_components/html-elements/Select'
import { Button } from '@app/_components/html-elements/Button'

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
                <input type="hidden" name="_id" value={recipe?._id} />
                <label className="mb-1">
                    <div className="font-bold">Title</div>
                    <Input name="title" required defaultValue={recipe?.title} />
                    {errors[0] && <p>{errors[0]}</p>}
                </label>
                <label className="mb-1">
                    <div className="font-bold">URL</div>
                    <Input type="url" name="url" defaultValue={recipe?.url} />
                </label>

                <fieldset>
                    <legend className="font-bold">Ingredients</legend>

                    {errors[1] && <p className="">{errors[1]}</p>}

                    <ul>
                        {map(numFields, (_, index) => (
                            <li
                                key={`recipe-input-${index}`}
                                className="border border-slate-300 rounded-lg p-4 mb-3 bg-slate-100"
                            >
                                <label className="mb-1">
                                    <div className="font-bold">Ingredient {index + 1}</div>
                                    <Input
                                        name={`ingredient[${index}]`}
                                        defaultValue={recipe?.ingredients[index]?.title}
                                    />
                                </label>
                                <label className="mb-1">
                                    <div className="font-bold">Amount {index + 1}</div>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name={`amount[${index}]`}
                                        defaultValue={recipe?.ingredients[index]?.amount}
                                    />
                                </label>
                                <label className="mb-1">
                                    <div className="font-bold">Unit {index + 1}</div>
                                    <Select name={`unit[${index}]`} defaultValue={recipe?.ingredients[index]?.unit}>
                                        {Object.entries(UNITS_SELECTION).map(([index, value]) => {
                                            if (typeof value === 'string') {
                                                return (
                                                    <option key={`selection-${index}-${value}`} value={index}>
                                                        {value}
                                                    </option>
                                                )
                                            }
                                            return (
                                                <optgroup label={index} key={`optgroup-${index}`}>
                                                    {value.map((value) => (
                                                        <option key={`selection-${index}-${value}`} value={value}>
                                                            {value}
                                                        </option>
                                                    ))}
                                                </optgroup>
                                            )
                                        })}
                                    </Select>
                                </label>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <div className="flex gap-1">
                    <Button onClick={() => router.back()} type="button">
                        Cancel
                    </Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </>
    )
}
