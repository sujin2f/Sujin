'use client'
import { type ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import Select from '@common/components/forms/Select'
import { Button } from '@app/_components/html-elements/Button'
// /* CONSTANTS */
import { QuantumBool } from '@sujin/share/types' // TODO
/* Utils */
import { getRecipe } from '@app/recipe/_lib/getRecipe'
import { useUserInfo } from '@app/_lib/hooks/useUserInfo'
import { useRecipeDelete } from '@app/_lib/hooks/useRecipeDelete'
import { useServerAction } from '@app/_lib/hooks/useServerAction'
/* T_Types */
import {
    type T_Recipe,
    type UNITS,
    UNITS_WEIGHT,
    UNITS_VOLUMES,
    CONVERT_WEIGHT,
    CONVERT_VOLUMES,
} from '@sujin/lib/types' // TODO

type Props = {
    id: string
}

export const dynamic = 'force-dynamic'

export default function DetailClient() {
    const router = useRouter()
    const { id } = useParams<Props>()
    const user = useUserInfo()
    const { data: recipe, loading, error } = useServerAction<T_Recipe>(async () => await getRecipe(id))
    const { setConfirm, pending, Confirm } = useRecipeDelete(id)
    const [converted, setConverted] = useState<T_Recipe['ingredients']>([])
    const [focused, setFocused] = useState<false | number>(false)

    const onQuantityChange = useCallback(
        (index: number, value: number) => {
            if (isNaN(value)) {
                return
            }

            const ratio = (value || 0) / converted[index].amount
            setConverted(
                converted.map((item, i) => {
                    if (i === index) {
                        return { ...item, amount: value || 0 }
                    }
                    return {
                        ...item,
                        amount: item.amount * ratio,
                    }
                }),
            )
        },
        [converted],
    )

    const onUnitChange = useCallback(
        (index: number, value: UNITS) => {
            const result = [...converted]
            const unit = result[index].unit
            const conversion: Record<string, number> = Object.keys(CONVERT_VOLUMES).includes(unit)
                ? CONVERT_VOLUMES
                : CONVERT_WEIGHT

            if (conversion[unit] && conversion[value]) {
                result[index].amount = (result[index].amount * conversion[unit]) / conversion[value]
                result[index].unit = value
            }
            setConverted(result)
        },
        [converted],
    )

    useEffect(() => {
        if (recipe) {
            setConverted(recipe.ingredients)
        }
    }, [recipe])

    if (loading) {
        return <></>
    }
    if (error) {
        return <></>
    }
    if (!recipe) return <></>
    if (!loading && !error && !recipe) return <></>

    return (
        <>
            {Confirm}

            <WidgetTitle>Ingredients</WidgetTitle>

            <dl className="grid grid-cols-2">
                {converted.map((item, index) => (
                    <Fragment key={`recipe-${item.title}-${index}`}>
                        <dt className="col-span-2">{item.title}</dt>
                        <dd>
                            <input
                                type="number"
                                value={focused !== index ? parseFloat(item.amount.toString()).toFixed(2) : item.amount}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setFocused(index)
                                    onQuantityChange(index, parseFloat(e.target.value))
                                }}
                                onBlur={(e: ChangeEvent<HTMLInputElement>) => {
                                    setFocused(false)
                                    onQuantityChange(index, parseFloat(e.target.value))
                                }}
                            />
                        </dd>
                        <dd>
                            {item.unit === 'ea' && <>{item.unit as string}</>}
                            {(UNITS_WEIGHT as unknown as string[]).includes(item.unit) && (
                                <Select
                                    options={UNITS_WEIGHT as unknown as string[]}
                                    value={item.unit}
                                    onChange={(e) => onUnitChange(index, e.target.value as UNITS)}
                                />
                            )}
                            {(UNITS_VOLUMES as unknown as string[]).includes(item.unit) && (
                                <Select
                                    options={UNITS_VOLUMES as unknown as string[]}
                                    value={item.unit}
                                    onChange={(e) => onUnitChange(index, e.target.value as UNITS)}
                                />
                            )}
                        </dd>
                    </Fragment>
                ))}
            </dl>
            <nav>
                {user && user._id ? (
                    <Button onClick={() => router.replace('/recipe/mine/1')} title="My Recipes" disabled={pending} />
                ) : (
                    <Button onClick={() => router.replace('/recipe/list/1')} disabled={pending}>
                        Public Recipes
                    </Button>
                )}

                {user && user._id === recipe.user ? (
                    <>
                        <Button
                            onClick={() => router.replace(`/recipe/edit/${recipe._id}`)}
                            title="Edit"
                            disabled={pending}
                        />
                        <Button
                            onClick={() => {
                                setConfirm(QuantumBool.MOD)
                            }}
                            title="Delete"
                            disabled={pending}
                        />
                    </>
                ) : (
                    <></>
                )}
            </nav>
        </>
    )
}
