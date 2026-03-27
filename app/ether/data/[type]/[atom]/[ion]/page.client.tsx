'use client'
import { useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
/* Components */
import { DataHeader } from '@lib/components/ether/DataHeader'
import ScrollToTop from '@app/_components/ScrollToTop'
import Row from '@common-old/components/layout/Row'
import Column from '@common-old/components/layout/Column'
import { Chart } from '@lib/components/ether/Chart'
import { Table } from '@lib/components/ether/Table'
import { DataContainer } from '@app/ether/data/models/DataContainer'
/* Utils */
import { RootState } from '@app/_store'
import { pushSpectrum } from '@app/_store/slices/spectrum'
import { useServerAction } from '@app/_lib/hooks/useServerAction'
/* T_Types */
import type { ISpectrum } from '@common/types'
/* Assets */
import LoadingImg from '@app/_lib/images/loading.svg'

type Props = {
    readonly action: () => Promise<ISpectrum[]>
}

type Params = {
    type: 'ether' | 'orbital'
    atom: string
    ion: string
    term: string
}

export function DataPageClient({ action }: Props) {
    const params = useParams<Params>()
    const atom = parseInt(params.atom)
    const ion = parseInt(params.ion)

    // Redux
    const dispatch = useDispatch()
    const store = useSelector((state: RootState) => state.spectrum.spectrum)
    const spectrum = useMemo(() => (store[atom] && store[atom][ion] ? store[atom][ion] : []), [atom, ion, store])
    const hasStore = useMemo(() => !!spectrum.length, [spectrum])

    // Read from GraphQL
    const { data, loading } = useServerAction(action, hasStore)

    useEffect(() => {
        if (!hasStore && data && data.length) {
            dispatch(pushSpectrum([atom, ion, data]))
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
            <DataHeader container={orbital} atom={atom} ion={ion} type={params.type} />
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
