'use client'
import { type ChangeEvent, useCallback, useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import Input from '@common/components/forms/Input'
import Button from '@common/components/forms/Button'
import ButtonGroup from '@common/components/forms/ButtonGroup'
import Select from '@common/components/forms/Select'
// /* CONSTANTS */
import { QuantumBool } from '@sujin/share/types' // TODO
/* Utils */
import { getRecipe } from '@app/recipe/_lib/getRecipe'
import { useUserInfo } from '@app/_hooks/useUserInfo'
import { useRecipeDelete } from '@app/_hooks/useRecipeDelete'
import { useServerAction } from '@app/_hooks/useServerAction'
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

export default function DetailClient() {
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
        throw error
    }
    if (!pending && !recipe) notFound()
    if (!recipe) return <></>

    return (
        <>
            {Confirm}

            <WidgetTitle>{recipe.title}</WidgetTitle>

            <table>
                <tbody>
                    {converted.map((item, index) => (
                        <tr key={item.title}>
                            <th>{item.title}</th>
                            <td>
                                <Input
                                    type="number"
                                    value={
                                        focused !== index ? parseFloat(item.amount.toString()).toFixed(2) : item.amount
                                    }
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                        setFocused(index)
                                        onQuantityChange(index, parseFloat(e.target.value))
                                    }}
                                    onBlur={(e: ChangeEvent<HTMLInputElement>) => {
                                        setFocused(false)
                                        onQuantityChange(index, parseFloat(e.target.value))
                                    }}
                                />
                            </td>
                            <td>
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <nav>
                {user && user._id ? (
                    <Button href="/recipe/mine/1" title="My Recipes" disabled={pending} />
                ) : (
                    <Button href="/recipe/list/1" title="Public Recipes" disabled={pending} />
                )}

                {user && user._id === recipe.user ? (
                    <ButtonGroup gap>
                        <Button href={`/recipe/edit/${recipe._id}`} title="Edit" disabled={pending} />
                        <Button
                            onClick={() => {
                                setConfirm(QuantumBool.MOD)
                            }}
                            title="Delete"
                            disabled={pending}
                        />
                    </ButtonGroup>
                ) : (
                    <></>
                )}
            </nav>
        </>
    )
}
