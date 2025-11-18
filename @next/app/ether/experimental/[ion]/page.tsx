'use client'
import { Fragment, useEffect, useState } from 'react'
/* Components */
import { Table } from '@lib/components/ether/Table'
import ScrollToTop from '@common/components/ScrollToTop'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { Chart } from '@lib/components/ether/Chart'
/* T_Types */
import type { Nullable } from '@sujin/share/types'
import type { ISpectrum } from '@app/ether/data/types'
/* Utils */
// TODO
import { fetchGQL } from '@sujin/common/data/graphql/fetchGQL'
import GQL from '../../../api/graphql/_lib/constants'
/* Models */
import { DataContainer } from '@app/ether/data/models/DataContainer'

export default function DataPage() {
    const [spectra, setSpectra] = useState<Nullable<ISpectrum[]>>()

    useEffect(() => {
        fetchGQL(
            GQL.queryMongoSpectra,
            GQL.spectraOpr,
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
