'use client'
import { type ChangeEvent, useCallback, useState } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import { WidgetTitle } from '@app/_components/WidgetTitle'
import Link from 'next/link'
import Table from '@common/components/containers/Table'
import Input from '@common/components/forms/Input'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Button from '@common/components/forms/Button'
import ButtonGroup from '@common/components/forms/ButtonGroup'
import Select from '@common/components/forms/Select'
/* T_Types */
import {
    type T_Recipe,
    type UNITS,
    UNITS_WEIGHT,
    UNITS_VOLUMES,
    CONVERT_WEIGHT,
    CONVERT_VOLUMES,
} from '@sujin/lib/types' // TODO
/* CONSTANTS */
import { QuantumBool } from '@sujin/share/types' // TODO
/* Utils */
import { useUserInfo } from '@app/_hooks/useUserInfo'
import { useRecipeDelete } from '@app/_hooks/useRecipeDelete'

type Props = {
    readonly recipe: T_Recipe
}

export function DetailClient({ recipe }: Props) {
    const user = useUserInfo()
    const { setConfirm, pending, Confirm } = useRecipeDelete(recipe._id)

    const [converted, setConverted] = useState(recipe?.ingredients || [])
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

    if (!pending && !recipe) notFound()
    if (!recipe) return <></>

    return (
        <>
            {Confirm}

            <WidgetTitle>{recipe.title}</WidgetTitle>

            {recipe.url && (
                <h3>
                    <Link href={recipe.url} target="_blank">
                        {recipe.url}
                    </Link>
                </h3>
            )}

            <Table fullWidth className="recipe__single">
                <tbody>
                    {converted.map((item, index) => (
                        <tr key={item.title}>
                            <th className="recipe__ingredient --right">{item.title}</th>
                            <td className="recipe__amount">
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
                            <td className="recipe__unit">
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
            </Table>

            <Row fullWidth>
                <Column large={6}>
                    {user && user._id ? (
                        <Button href="/recipe/mine/1" title="My Recipes" disabled={pending} />
                    ) : (
                        <Button href="/recipe/1" title="Public Recipes" disabled={pending} />
                    )}
                </Column>
                <Column className="--right" large={6}>
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
                </Column>
            </Row>
        </>
    )
}
