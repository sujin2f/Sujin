'use client'
import { Fragment, useEffect, useState } from 'react'
/* Helpers */
import type { Nullable } from '@common/types'
import type { ISpectrum } from '@src/types/ether'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { queryMongoSpectra, spectraOpr } from '@src/constants/graphql'
import { DataContainer } from '@src/models/DataContainer'
import { Table } from '@components/ether/table'
import ScrollToTop from '@components/ScrollToTop'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Chart } from '@components/ether/chart'

export default function DataPage() {
    const [spectra, setSpectra] = useState<Nullable<ISpectrum[]>>()

    useEffect(() => {
        fetchGQL(
            queryMongoSpectra,
            spectraOpr,
            0,
            encodeURIComponent(JSON.stringify({ ionReverse: 1, orbital: 's' })),
        )
            .then((result) => setSpectra(result))
            .catch(() => setSpectra([]))
    }, [])

    if (!spectra) {
        return <></>
    }
    const container = new DataContainer(spectra, 'orbital')
    const chartData = Object.entries(container.chartData).reduce(
        (acc, [key, value]) => {
            if (value.filter((v) => !isNaN(v)).length === 0) {
                return acc
            }
            if (key.indexOf('Radial') === -1) {
                return acc
            }

            const number = key.match(/[0-9]+/)
            if (!number) {
                return acc
            }
            return {
                ...acc,
                [number.toString()]: value,
            }
        },
        {},
    )

    return (
        <>
            <ScrollToTop />
            <Row>
                <Column small={12}>
                    <Chart data={chartData} />
                </Column>
            </Row>
            <Row>
                <Column small={12}>
                    {container.map((atom, index) => (
                        <Fragment key={`atom-${index}`}>
                            <h3>{atom.toString()}</h3>
                            <Table orbital={atom} />
                        </Fragment>
                    ))}
                </Column>
            </Row>
        </>
    )
}
