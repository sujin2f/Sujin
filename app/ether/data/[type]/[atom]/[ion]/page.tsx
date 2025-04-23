'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
/* Components */
import { DataHeader } from '@app/ether/data/_components/DataHeader'
import ScrollToTop from '@common/components/ScrollToTop'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { Chart } from '@app/ether/data/_components/Chart'
import { Table } from '@app/ether/data/_components/Table'
/* Helpers */
import type { Nullable } from '@common/types'
import type { ISpectrum } from '@app/ether/data/types'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import GQL from '@app/api/graphql/constants'
import { DataContainer } from '@app/ether/data/models/DataContainer'

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
        fetchGQL(GQL.querySpectra, GQL.spectraOpr, 0, atom, ion)
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
                    <Table orbital={orbital} />
                </Column>
            </Row>
        </>
    )
}
