'use client'
import { type ChangeEvent, useCallback, useState } from 'react'
import { notFound } from 'next/navigation'
/* Components */
import Link from 'next/link'
import Table from '@sujin/common/components/containers/Table'
import Input from '@sujin/common/components/forms/Input'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
import Button from '@sujin/common/components/forms/Button'
import ButtonGroup from '@sujin/common/components/forms/ButtonGroup'
import Select from '@sujin/common/components/forms/Select'
/* T_Types */
import {
    type T_Recipe,
    type UNITS,
    UNITS_WEIGHT,
    UNITS_VOLUMES,
    CONVERT_WEIGHT,
    CONVERT_VOLUMES,
} from '@app/_lib/types'
import type { T_Stringify } from '@sujin/common/types/mongo'
/* CONSTANTS */
import { QuantumBool } from '@sujin/common/types'
/* Utils */
import { useDelete } from '@app/recipe/_lib/useDelete'
import { useSession } from 'next-auth/react'

type Props = {
    readonly recipe: T_Stringify<T_Recipe>
}

export function ItemClient({ recipe }: Props) {
    const { setConfirm, isPending, Confirm } = useDelete(
        recipe._id,
        '/recipe/mine/1',
    )
    const session = useSession()
    const userId = session?.data?.user
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (session?.data?.user as any)._id
        : undefined
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
            const conversion: Record<string, number> = Object.keys(
                CONVERT_VOLUMES,
            ).includes(unit)
                ? CONVERT_VOLUMES
                : CONVERT_WEIGHT

            if (conversion[unit] && conversion[value]) {
                result[index].amount =
                    (result[index].amount * conversion[unit]) /
                    conversion[value]
                result[index].unit = value
            }
            setConverted(result)
        },
        [converted],
    )

    if (!isPending && !recipe) notFound()
    if (!recipe) return <></>

    return (
        <>
            {Confirm}

            <h3>
                <Link href={recipe.url} target="_blank">
                    {recipe.url}
                </Link>
            </h3>

            <Table fullWidth className="recipe__single">
                <tbody>
                    {converted.map((item, index) => (
                        <tr key={item.title}>
                            <th className="recipe__ingredient --right">
                                {item.title}
                            </th>
                            <td className="recipe__amount">
                                <Input
                                    type="number"
                                    value={
                                        focused !== index
                                            ? parseFloat(
                                                  item.amount.toString(),
                                              ).toFixed(2)
                                            : item.amount
                                    }
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        setFocused(index)
                                        onQuantityChange(
                                            index,
                                            parseFloat(e.target.value),
                                        )
                                    }}
                                    onBlur={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        setFocused(false)
                                        onQuantityChange(
                                            index,
                                            parseFloat(e.target.value),
                                        )
                                    }}
                                />
                            </td>
                            <td className="recipe__unit">
                                {item.unit === 'ea' && (
                                    <>{item.unit as string}</>
                                )}
                                {(UNITS_WEIGHT as unknown as string[]).includes(
                                    item.unit,
                                ) && (
                                    <Select
                                        options={
                                            UNITS_WEIGHT as unknown as string[]
                                        }
                                        value={item.unit}
                                        onChange={(e) =>
                                            onUnitChange(
                                                index,
                                                e.target.value as UNITS,
                                            )
                                        }
                                    />
                                )}
                                {(
                                    UNITS_VOLUMES as unknown as string[]
                                ).includes(item.unit) && (
                                    <Select
                                        options={
                                            UNITS_VOLUMES as unknown as string[]
                                        }
                                        value={item.unit}
                                        onChange={(e) =>
                                            onUnitChange(
                                                index,
                                                e.target.value as UNITS,
                                            )
                                        }
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Row fullWidth>
                <Column large={6}>
                    {userId ? (
                        <Button
                            href="/recipe/mine/1"
                            title="My Recipes"
                            disabled={isPending}
                        />
                    ) : (
                        <Button
                            href="/recipe/1"
                            title="Public Recipes"
                            disabled={isPending}
                        />
                    )}
                </Column>
                <Column className="--right" large={6}>
                    {userId === recipe.user && (
                        <ButtonGroup gap>
                            <Button
                                href={`/recipe/mutate/${recipe._id}`}
                                title="Edit"
                                disabled={isPending}
                            />
                            <Button
                                onClick={() => {
                                    setConfirm(QuantumBool.MOD)
                                }}
                                title="Delete"
                                disabled={isPending}
                            />
                        </ButtonGroup>
                    )}
                </Column>
            </Row>
        </>
    )
}
