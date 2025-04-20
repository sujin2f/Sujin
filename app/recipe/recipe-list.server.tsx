'use client'
import { type ChangeEvent, useState } from 'react'

import Table from '@common/components/containers/Table'
import { Button } from '@common/components/forms/Button'
import Input from '@common/components/forms/Input'
import Select from '@common/components/forms/Select'

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
    const options: Record<string, string> = {
        '': 'Select Unit',
        g: 'g',
        ml: 'ml',
        tbs: 'tbs',
        ts: 'ts',
        ea: 'ea',
    }
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
                <Button>Submit</Button>
            </form>
            <div>{page}</div>

            <h2>https://preppykitchen.com/pound-cake/#recipe</h2>

            <Table fullWidth>
                <tbody>
                    {converted.map((item, index) => (
                        <tr key={item.title}>
                            <th>{item.title}</th>
                            <td>
                                <Input
                                    type="number"
                                    value={item.amount}
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
                            <td>
                                <Select
                                    options={options}
                                    defaultValue={item.unit}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
