'use client'
import { useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
/* Components */
import { DataHeader } from '@lib/components/ether/DataHeader'
import ScrollToTop from '@common/components/ScrollToTop'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { Chart } from '@lib/components/ether/Chart'
import { Table } from '@lib/components/ether/Table'
/* Helpers */
import type { ISpectrum } from '@sujin/lib/types'
import { DataContainer } from '@app/ether/data/models/DataContainer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@lib/store'
import { useQuery } from '@apollo/client/react'
import { pushSpectrum } from '@lib/store/slices/spectrum'
/* CONSTANTS */
import SPECTRUM_QUERY from '@lib/apollo/gql/spectrum.graphql'
/* Assets */
import LoadingImg from '@common/images/loading.svg'

export default function DataPage() {
    const params = useParams<EtherDataProps>()

    const atom = parseInt(params.atom)
    const ion = parseInt(params.ion)

    // Redux
    const dispatch = useDispatch()
    const store = useSelector((state: RootState) => state.spectrum.spectrum)
    const spectrum = useMemo(
        () => (store[atom] && store[atom][ion] ? store[atom][ion] : []),
        [atom, ion, store],
    )
    const hasStore = useMemo(() => !!spectrum.length, [spectrum])

    // Read from GraphQL with Intersection Observer & update store
    const { data, loading } = useQuery<{ spectra: ISpectrum[] }>(
        SPECTRUM_QUERY,
        {
            variables: { number: atom, ion },
            skip: hasStore,
        },
    )

    useEffect(() => {
        if (!hasStore && data && data.spectra.length) {
            dispatch(pushSpectrum([atom, ion, data.spectra]))
        }
    }, [data, hasStore, dispatch, atom, ion])

    if (loading) {
        return (
            <>
                <ScrollToTop />
                <DataHeader atom={atom} ion={ion} type={params.type} />
                <Row>
                    <Column small={12}>
                        <LoadingImg />
                    </Column>
                </Row>
            </>
        )
    }
    if (!spectrum.length) {
        return (
            <>
                <ScrollToTop />
                <DataHeader atom={atom} ion={ion} type={params.type} />
            </>
        )
    }

    const container = new DataContainer(spectrum, params.type)
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
