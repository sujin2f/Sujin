'use client'
import { type ChangeEvent, useCallback, useState } from 'react'
import { redirect } from 'next/navigation'
/* Components */
import Link from 'next/link'
import Table from '@common/components/containers/Table'
import Input from '@common/components/forms/Input'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Button from '@common/components/forms/Button'
import ButtonGroup from '@common/components/forms/ButtonGroup'
import Confirm from '@common/components/containers/Confirm'
/* T_Types */
import type { T_Recipe, T_SessionUser } from '@app/_lib/types'
import type { T_Stringify } from '@common/types/mongo'
import { QuantumBool } from '@common/types'

type Props = {
    readonly recipe: T_Stringify<T_Recipe>
    readonly user: T_SessionUser | undefined
    readonly remove: (_id: string) => Promise<void>
}

export function ItemClient({ recipe, user, remove }: Props) {
    const { title, url, ingredients } = recipe
    const [converted, setConverted] = useState(ingredients)
    const [confirm, setConfirm] = useState<QuantumBool>(QuantumBool.FALSE)

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

    const confirmDelete = useCallback(
        async (value: QuantumBool) => {
            setConfirm(value)
            if (value === QuantumBool.TRUE) {
                await remove(recipe._id)
                redirect('/recipe/mine/1')
            }
        },
        [remove, recipe._id],
    )

    return (
        <>
            <h2>{title}</h2>
            <h3>
                <Link href={url} target="_blank">
                    {url}
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

            <Row fullWidth>
                <Column large={6}>
                    {user ? (
                        <Button href="/recipe/mine/1" title="My Recipes" />
                    ) : (
                        <Button href="/recipe/1" title="Public Recipes" />
                    )}
                </Column>
                <Column className="--right" large={6}>
                    {user?._id === recipe.user && (
                        <ButtonGroup>
                            <Button
                                href={`/recipe/mutate/${recipe._id}`}
                                title="Edit"
                            />
                            <Confirm callback={confirmDelete} value={confirm}>
                                Do you really want to delete this?
                            </Confirm>
                            <Button
                                onClick={() => setConfirm(QuantumBool.MOD)}
                                title="Delete"
                            />
                        </ButtonGroup>
                    )}
                </Column>
            </Row>
        </>
    )
}
