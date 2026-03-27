'use client'
import { Fragment } from 'react'
import Link from 'next/link'
/* Components */
import { default as TableComponent } from '@common-old/components/containers/Table'
/* Helpers */
import { Atom } from '@app/ether/data/models/Atom'
import { ROW_HEAD } from '@common/constants/ether'
import { map } from '@common/utils/array'

type Props = {
    orbital: Atom
}

export const Table = ({ orbital }: Props) => {
    return (
        <TableComponent className="ether">
            {orbital.map((term, termIndex) => (
                <Fragment key={`term-${term.toString()}-${termIndex}`}>
                    {/* Term */}
                    <thead>
                        <tr>
                            <th colSpan={orbital.maxColumn + 2} className="table__ether__term-group">
                                <Link href={`?term=${term.toString()}`}>{term.toString()}</Link>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {term.map((line, index) => (
                            <Fragment key={`line-${term.toString()}-${index}`}>
                                {ROW_HEAD.map((row, index) => {
                                    const value = line.value[index]

                                    return (
                                        <tr key={`conf-${term.toString()}-${index}-${row}`}>
                                            {index === 0 && <th rowSpan={ROW_HEAD.length}>{line.toString()}</th>}
                                            <th>{row}</th>

                                            {map(orbital.maxColumn, (_, col) => (
                                                <td
                                                    key={`conf-${term.toString()}-${index}-${row}-${col}-${value[col]}`}
                                                >
                                                    {typeof value[col] !== 'number' || !isNaN(value[col])
                                                        ? value[col]
                                                        : ''}
                                                </td>
                                            ))}
                                        </tr>
                                    )
                                })}
                            </Fragment>
                        ))}
                    </tbody>
                </Fragment>
            ))}
        </TableComponent>
    )
}
