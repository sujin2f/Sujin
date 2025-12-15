'use client'
import { useRouter } from 'next/navigation'
/* T_Types */
import { T_Recipe, UNITS_SELECTION } from '@sujin/lib/types'
/* Utils */
import { map } from '@sujin/share/utils/array'
import { useRecipeCreate } from '@app/_hooks/useRecipeMutate'
/* CONSTANTS */
import { TAILWIND_BUTTON, TAILWIND_INPUT } from '@app/_lib/constants'

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
                    <input name="title" required className={TAILWIND_INPUT} defaultValue={recipe?.title} />
                    {errors[0] && <p>{errors[0]}</p>}
                </label>
                <label className="mb-1">
                    <div className="font-bold">URL</div>
                    <input type="url" name="url" required className={TAILWIND_INPUT} defaultValue={recipe?.url} />
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
                                    <input
                                        name={`ingredient[${index}]`}
                                        className={TAILWIND_INPUT}
                                        defaultValue={recipe?.ingredients[index]?.title}
                                    />
                                </label>
                                <label className="mb-1">
                                    <div className="font-bold">Amount {index + 1}</div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name={`amount[${index}]`}
                                        className={TAILWIND_INPUT}
                                        defaultValue={recipe?.ingredients[index]?.amount}
                                    />
                                </label>
                                <label className="mb-1">
                                    <div className="font-bold">Unit {index + 1}</div>
                                    <select
                                        name={`unit[${index}]`}
                                        defaultValue={recipe?.ingredients[index]?.unit}
                                        className={`${TAILWIND_INPUT} py-1.5`}
                                    >
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
                                    </select>
                                </label>
                            </li>
                        ))}
                    </ul>
                </fieldset>
                <div className="flex gap-1">
                    <button className={TAILWIND_BUTTON} onClick={() => router.back()} type="button">
                        Cancel
                    </button>
                    <button type="submit" className={TAILWIND_BUTTON}>
                        Submit
                    </button>
                </div>
            </form>
        </>
    )
}
