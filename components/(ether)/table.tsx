'use client'
import { Fragment } from 'react'
import Link from 'next/link'
/* Components */
import { Table as TableComponent } from '@common/components/containers/Table'
/* Helpers */
import type { TableData } from '@src/types/ether'

type Props = {
    data: TableData
    rowHead: string[]
    maxColumn: number
}

export const Table = ({ data, rowHead, maxColumn }: Props) => {
    return (
        <>
            <TableComponent className="ether">
                {Object.entries(data).map(([groupKey, group], groupIndex) => (
                    <Fragment key={`term-group-${groupKey}-${groupIndex}`}>
                        {/* Group */}
                        <thead>
                            <tr>
                                <th
                                    colSpan={maxColumn + 2}
                                    className="table__ether__term-group"
                                >
                                    <Link href={`?term=${groupKey}`}>
                                        {groupKey}
                                    </Link>
                                </th>
                            </tr>
                        </thead>

                        {Object.entries(group).map(
                            ([rowsLabel, rows], rowsIndex) => (
                                <tbody
                                    key={`tbody-${groupKey}-${groupIndex}-${rowsLabel}-${rowsIndex}`}
                                >
                                    {rows.map((row, index) => (
                                        <tr
                                            key={`tr-${groupKey}-${groupIndex}-${rowsLabel}-${rowsIndex}-${index}`}
                                        >
                                            {index === 0 && (
                                                <th rowSpan={rowHead.length}>
                                                    {rowsLabel}
                                                </th>
                                            )}

                                            <th>{rowHead[index]}</th>

                                            {row.map((col, colIndex) => (
                                                <td
                                                    key={`td-${groupIndex}-${rowsLabel}-${colIndex}`}
                                                >
                                                    {col}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            ),
                        )}
                    </Fragment>
                ))}
            </TableComponent>
        </>
    )
}
