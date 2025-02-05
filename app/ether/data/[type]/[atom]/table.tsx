'use client'

import { getSpectra2 } from '@src/utils/ether'
import { ChartData, ISpectrum, TableData } from '@src/types/ether'
import { Lines } from '@src/utils/model-spectra'
import { Table as Tbl } from '@components/ether/table'
import { Chart } from '@components/ether/chart'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Fragment } from 'react'

export function Table({ items }: { items: ISpectrum[] }) {
    const orbital = getSpectra2(items)
    const chartData: ChartData = {}
    const orbital2: Record<string, TableData> = Object.entries(orbital).reduce(
        (acc, [atom, value]) => {
            return {
                ...acc,
                [atom]: Object.entries(value).reduce(
                    (acc2, [termGroup, value2]) => {
                        if (termGroup !== '0-0') {
                            return acc2
                        }
                        const lines = value2.map(
                            (spectra) => new Lines(spectra),
                        )[0]

                        // if (
                        //     lines.items[2].ion >= 20
                        //     //  &&
                        //     // lines.items[2].ion <= 50
                        // ) {
                        chartData[atom] = lines.items.map(
                            (item) => item.comparison2,
                        )
                        // }

                        return {
                            ...acc2,
                            [termGroup]: {
                                row: [
                                    lines.items.map((item) => item.orbital),
                                    lines.items.map((item) => item.energy),
                                    lines.items.map((item) => item.diff),
                                    lines.items.map((item) => item.rydberg),
                                    lines.items.map((item) => item.comparison2),
                                ],
                            },
                        }
                    },
                    {},
                ),
            }
        },
        {},
    )
    console.log(orbital2)

    return (
        <>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <div>1</div>
            <Row>
                <Column small={12}>
                    <Chart data={chartData} />
                    {Object.entries(orbital2).map(([gKey, group]) => (
                        <Fragment key={`table-${gKey}`}>
                            <h3>{gKey}</h3>
                            <Tbl
                                data={group}
                                rowHead={['Orbital', 'E', 'Diff', 'R', 'Comp']}
                                maxColumn={12}
                            />
                        </Fragment>
                    ))}
                </Column>
            </Row>
            {/* <table border={1}>
                <tbody>
                    {Object.entries(orbital2).map(([gKey, group]) =>
                        Object.entries(group).map(([dKey, line]) =>
                            line.map((line, index) => (
                                <tr key={`tr-${gKey}-${dKey}-${index}`}>
                                    {line.items.map((item, index) => {
                                        return (
                                            <td
                                                key={`td-${gKey}-${dKey}-${index}`}
                                            >
                                                {!isNaN(item.comparison)
                                                    ? item.comparison
                                                    : ''}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )),
                        ),
                    )}
                </tbody>
            </table> */}
        </>
    )
}
