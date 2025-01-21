import { redirect } from 'next/navigation'

import { periodicTable } from '@src/constants/spectra'
import { getNistData } from '@src/db/fetch/getNistData'
import { getClientData, sortEther, getSpectra } from '@src/utils/ether'
import { Data } from '@components/(ether)/data'
import { DataHeader } from '@components/(ether)/data-header'

export default async function DataPage(props: EtherDataServerProps) {
    const params = await props.params
    const type = params.type
    if (type !== 'ether' && type !== 'orbital') {
        redirect('/404')
    }
    const atom = parseInt(params.atom)
    const ion = parseInt(params.ion)

    const response = await getNistData(periodicTable[atom - 1], ion)
    const [orbital, ratio, kRadial, kLinear] = getSpectra(response, atom, ion)
    const spectra = type === 'ether' ? sortEther(orbital) : orbital
    const [chartData, tableData, rowHead, maxColumn] = getClientData(
        spectra,
        ratio,
        kRadial,
        kLinear,
    )
    const terms = Object.keys(tableData)

    return (
        <>
            <DataHeader terms={terms} />
            <Data
                chartData={chartData}
                tableData={tableData}
                rowHead={rowHead}
                maxColumn={maxColumn}
            />
        </>
    )
}
