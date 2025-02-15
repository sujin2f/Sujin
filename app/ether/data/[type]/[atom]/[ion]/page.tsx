'use client'
import { Fragment, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
/* Components */
import { DataHeader } from '@components/ether/data-header'
import ScrollToTop from '@components/ScrollToTop'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Table } from '@common/components/containers/Table'
import { Chart } from '@components/ether/chart'
/* Helpers */
import type { Nullable } from '@common/types'
import type { ISpectrum } from '@src/types/ether'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { querySpectra, spectraOpr } from '@src/constants/graphql'
import { map } from '@common/utils/array'
import { ROW_HEAD } from '@src/constants/ether'
import { DataContainer } from '@src/models/DataContainer'

export default function DataPage() {
    const params = useParams<EtherDataProps>()
    const [spectra, setSpectra] = useState<Nullable<ISpectrum[]>>()

    if (!params || !params.atom || !params.ion || !params.type) {
        return <></>
    }

    const atom = parseInt(params.atom)
    const ion = parseInt(params.ion)

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetchGQL(querySpectra, spectraOpr, 0, atom, ion)
            .then((result) => setSpectra(result))
            .catch(() => setSpectra([]))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!spectra) {
        return <></>
    }
    const container = new DataContainer(spectra, params.type)
    const orbital = container.get(atom, ion)

    return (
        <>
            <ScrollToTop />
            <DataHeader
                container={orbital}
                atom={atom}
                ion={ion}
                type={params.type}
            />
            <Row>
                <Column small={12}>
                    <Chart data={orbital.chartData} />
                </Column>
            </Row>
            <Row>
                <Column small={12}>
                    <Table className="ether">
                        {orbital.map((term, termIndex) => (
                            <Fragment
                                key={`term-${term.toString()}-${termIndex}`}
                            >
                                {/* Term */}
                                <thead>
                                    <tr>
                                        <th
                                            colSpan={orbital.maxColumn + 2}
                                            className="table__ether__term-group"
                                        >
                                            <Link
                                                href={`?term=${term.toString()}`}
                                            >
                                                {term.toString()}
                                            </Link>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {term.map((line, index) => (
                                        <Fragment
                                            key={`line-${term.toString()}-${index}`}
                                        >
                                            {ROW_HEAD.map((row, index) => {
                                                const value = line.value[index]

                                                return (
                                                    <tr
                                                        key={`conf-${term.toString()}-${index}-${row}`}
                                                    >
                                                        {index === 0 && (
                                                            <th
                                                                rowSpan={
                                                                    ROW_HEAD.length
                                                                }
                                                            >
                                                                {line.toString()}
                                                            </th>
                                                        )}
                                                        <th>{row}</th>

                                                        {map(
                                                            orbital.maxColumn,
                                                            (_, col) => (
                                                                <td
                                                                    key={`conf-${term.toString()}-${index}-${row}-${col}-${
                                                                        value[
                                                                            col
                                                                        ]
                                                                    }`}
                                                                >
                                                                    {typeof value[
                                                                        col
                                                                    ] !==
                                                                        'number' ||
                                                                    !isNaN(
                                                                        value[
                                                                            col
                                                                        ],
                                                                    )
                                                                        ? value[
                                                                              col
                                                                          ]
                                                                        : ''}
                                                                </td>
                                                            ),
                                                        )}
                                                    </tr>
                                                )
                                            })}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </Fragment>
                        ))}
                    </Table>
                </Column>
            </Row>
        </>
    )
}
