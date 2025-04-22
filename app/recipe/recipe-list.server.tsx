'use client'
import { type ChangeEvent, useState } from 'react'

import Table from '@common/components/containers/Table'
import { Button } from '@common/components/forms/Button'
import Input from '@common/components/forms/Input'
import Select from '@common/components/forms/Select'
import { UNITS } from '@app/_lib/types/recipe'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'

type Props = {
    page: number
}

export function RecipeListServer({ page }: Props) {
    const data = [
        { title: 'unsalted butter', amount: 226, unit: 'g' },
        { title: 'egg', amount: 4, unit: 'ea' },
        { title: 'sugar', amount: 200, unit: 'g' },
        { title: 'all-purpose flour', amount: 180, unit: 'g' },
        { title: 'sour cream', amount: 120, unit: 'ml' },
        { title: 'salt', amount: 1, unit: 'tbs' },
        { title: 'vanilla', amount: 2, unit: 'tbs' },
        { title: 'baking powder', amount: 0.5, unit: 'ts' },
    ]
    const [converted, setConverted] = useState(data)
    const onChange = (index: number, value: number) => {
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
    }

    return (
        <>
            <h2>input</h2>
            <form method="post">
                <Input label="Title" />
                <Input label="URL" />
                <fieldset>
                    <legend>Choose your favorite monster</legend>

                    <Row>
                        <Column small={4}>
                            <Input label="Ingredient" />
                        </Column>
                        <Column small={4}>
                            <Input label="Amount" />
                        </Column>
                        <Column small={4}>
                            <Select
                                label="Unit"
                                options={UNITS as unknown as string[]}
                            />
                        </Column>
                    </Row>
                </fieldset>
                <Button>Submit</Button>
            </form>
            <div>{page}</div>

            <h2>https://preppykitchen.com/pound-cake/#recipe</h2>

            <Table>
                <tbody>
                    {converted.map((item, index) => (
                        <tr key={item.title}>
                            <th className="--right">{item.title}</th>
                            <td>
                                <Input
                                    className="recipe__amount"
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
                            <td>{item.unit}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
