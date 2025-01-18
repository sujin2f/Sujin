'use client'

import { map } from '@common/utils/array'
import { Chart } from './chart'
import { Table } from '@common/components/containers/Table'
import { OrbitalMatrix } from '@src/types/ether'
import { getEtherConf, getRydberg } from '@src/utils/ether'

export const Data = ({
    group,
    ratio,
    kRadial,
    kLinear,
}: {
    group: Record<string, OrbitalMatrix[]>
    ratio: number
    kRadial: number
    kLinear: number
}) => {
    const matrix = ([] as OrbitalMatrix[]).concat(...Object.values(group))
    const maxColumn = Math.max(...matrix.map((row) => row.items.length))
    const data = matrix.map((term) => {
        const result: (string | number)[][] = [
            map(maxColumn, () => ''),
            map(maxColumn, () => ''),
            map(maxColumn, () => ''),
            map(maxColumn, () => ''),
            map(maxColumn, () => ''),
        ]
        term.items.forEach((item, index) => {
            const e1 = item ? item.energy : NaN
            const e2 = term.items[index - 1]
                ? term.items[index - 1].energy
                : NaN
            const diff = !isNaN(e1) && !isNaN(e2) ? e1 - e2 : ''
            const rydberg =
                item.orbital === 's'
                    ? getRydberg(ratio, kRadial, item.position)
                    : getRydberg(ratio, kLinear, item.position)

            result[0][index] = item && item.conf.join('.')
            result[1][index] = item && getEtherConf(item).toString()
            result[2][index] = item && item.energy.toFixed(8)
            result[3][index] = diff && diff.toFixed(8)
            result[4][index] = diff ? (diff / rydberg).toFixed(8) : ''
        })
        return result
    })
    const chartData: Record<string, number[]> = data
        .map((values) => values[4])
        .reduce(
            (acc, current, index) => ({
                ...acc,
                [matrix[index].term]: current,
            }),
            {},
        )

    const rowHead = ['conf', 'eConf', 'energy', 'diff', 'rydberg']

    return (
        <>
            <Chart data={chartData} columns={maxColumn} />
            <Table className="ether__data">
                {data.map((term, termIndex) => (
                    <tbody key={`tbody-${termIndex}`}>
                        {term.map((row, rowIndex) => (
                            <tr key={`tr-${termIndex}-${rowIndex}`}>
                                {rowIndex === 0 && (
                                    <th rowSpan={5}>
                                        {matrix[termIndex].j}.
                                        {matrix[termIndex].term}.
                                        {matrix[termIndex].spin}.
                                        {matrix[termIndex].conf.join('.')}
                                    </th>
                                )}

                                <th>{rowHead[rowIndex]}</th>

                                {row.map((col, colIndex) => (
                                    <td
                                        key={`td-${termIndex}-${rowIndex}-${colIndex}`}
                                    >
                                        {col}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                ))}
            </Table>
        </>
    )
}
