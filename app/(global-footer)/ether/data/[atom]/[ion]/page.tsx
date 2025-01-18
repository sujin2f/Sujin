import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Data } from '@components/(ether)/data'
import { ScrollToTop } from '@components/ScrollToTop'
import { periodicTable } from '@src/constants/spectra'
import { getNistData } from '@src/db/fetch/getNistData'
import { sortSpectra } from '@src/utils/ether'

type Props = {
    params: Promise<{
        atom: string
        ion: string
    }>
}

export default async function Atom(props: Props) {
    const params = await props.params
    const atom = parseInt(`${params.atom}`)
    const ion = parseInt(`${params.ion}`)

    const result = await getNistData(periodicTable[atom - 1], ion)
    const [group, ratio, kRadial, kLinear] = sortSpectra(result, atom, ion)

    return (
        <Row>
            <ScrollToTop />
            <Column small={12}>
                <Data
                    group={group}
                    ratio={ratio}
                    kRadial={kRadial}
                    kLinear={kLinear}
                />
            </Column>
        </Row>
    )
}
