'use client'
import { type ChangeEvent, useCallback, useState } from 'react'
/* Components */
import Link from 'next/link'
import Table from '@common/components/containers/Table'
import Input from '@common/components/forms/Input'
/* T_Types */
import type { T_Recipe } from '@app/_lib/types'

type Props = {
    readonly recipe: T_Recipe
}

export function ItemClient({ recipe }: Props) {
    const { recipe: ingredients } = recipe
    const [converted, setConverted] = useState(ingredients)

    const onChange = useCallback(
        (index: number, value: number) => {
            if (!value || isNaN(value)) {
                return
            }
            const ratio = value / converted[index].amount
            setConverted(
                converted.map((item, i) => {
                    if (i === index) {
                        return { ...item, amount: value }
                    }
                    return { ...item, amount: item.amount * ratio }
                }),
            )
        },
        [converted],
    )

    return (
        <>
            <h2>{recipe.title}</h2>
            <h3>
                <Link href={recipe.url} target="_blank">
                    {recipe.url}
                </Link>
            </h3>

            <Table fullWidth>
                <tbody>
                    {converted.map((item, index) => (
                        <tr key={item.title}>
                            <th className="--right">{item.title}</th>
                            <td className="recipe__amount">
                                <Input
                                    type="number"
                                    value={parseFloat(
                                        item.amount.toString(),
                                    ).toFixed(2)}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        e.preventDefault()
                                        onChange(
                                            index,
                                            parseInt(e.target.value),
                                        )
                                    }}
                                />
                            </td>
                            <td className="recipe__unit">
                                {item.unit as string}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
