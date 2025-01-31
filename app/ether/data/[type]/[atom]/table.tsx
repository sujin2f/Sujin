'use client'

import { getSpectra2 } from '@src/utils/ether'
import { ChartData, ISpectrum, TableData } from '@src/types/ether'
import { Lines } from '@src/utils/model-spectra'
import { Table as Tbl } from '@components/(ether)/table'
import { Chart } from '@components/(ether)/chart'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Fragment } from 'react'
import { average } from '@common/utils/array'

export function Table({ items }: { items: ISpectrum[] }) {
    const orbital = getSpectra2(items)
    const chartData: ChartData = {}
    const orbital2: Record<string, TableData> = Object.entries(orbital).reduce(
        (acc, [atom, value]) => {
            return {
                ...acc,
                [atom]: Object.entries(value).reduce(
                    (acc2, [termGroup, value2]) => {
                        const lines = value2.map(
                            (spectra) => new Lines(spectra),
                        )[0]

                        if (lines.items[2].ion < 20) {
                            chartData[atom] = lines.items.map(
                                (item) => item.comparison,
                            )
                        }

                        return {
                            ...acc2,
                            [termGroup]: {
                                row: [
                                    lines.items.map((item) => item.orbital),
                                    lines.items.map((item) => item.energy),
                                    lines.items.map((item) => item.diff),
                                    lines.items.map((item) => item.rydberg),
                                    lines.items.map((item) => item.comparison),
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

    // console.log(
    //     average([
    //         0.9998826321576011, 0.9998745227663981, 0.9998635437239224,
    //         0.9998521503776937, 0.9998425633676989, 0.999829307237396,
    //         0.9998148539053823, 0.999802910463803, 0.9997774835858516,
    //         0.9997733847793682, 0.9997553433052391, 0.9997403480732173,
    //         0.9997213368227351, 0.9997041092928066, 0.9996841143943521,
    //         0.9996654201376376, 0.9996432510949823,
    //     ]),
    // )

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
