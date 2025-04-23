'use client'
import { useState, useEffect } from 'react'

import { PropWithPages, type T_Recipe } from '@app/_lib/types'
import { T_Mongo } from '@common/types/mongo'
/* Constants */
import GQL from '@app/api/graphql/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import Switch from '@common/components/forms/Switch'
import { NewRecipe } from '@app/recipe/_components/new-recipe'

type Props = {
    readonly page: number
    addRecipe: (recipe: Omit<T_Recipe, '_id' | 'user'>) => Promise<void>
}

export function RecipeClient({ page, addRecipe }: Props) {
    const [my, setMy] = useState(false)
    const [list, setList] = useState<
        PropWithPages<T_Mongo<T_Recipe>> | boolean
    >(false)

    useEffect(() => {
        if (list === false) {
            setList(true)
            fetchGQL(
                GQL.queryRecipe,
                'list {title} pages',
                WEEK_IN_SECONDS,
                my,
                page,
            )
                .then((result) => {
                    setList(result)
                })
                .catch(() => {
                    setList(true)
                })
        }
    }, [list, my, page])

    console.log(list)

    return (
        <>
            <NewRecipe addRecipe={addRecipe} />

            <Switch
                onChange={(e) => {
                    setList(false)
                    setMy(e)
                }}
            />
            {/*

            <Table>
                <tbody>
                    {list.map((item, index) => (
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
                            <td>{item.unit as string}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={3} className="--loader--text"></td>
                    </tr>
                </tbody>
            </Table> */}
        </>
    )
}
