/* Components */
import { DataPageClient } from '@app/ether/data/[type]/[atom]/[ion]/page.client'
/* Utils */
import { spectrum } from '@lib/apollo/queries/misc/spectrum'
import { gqlRequest } from '@app/_lib/utils/redis'
/* Assets */
import { COLLECTION } from '@sujin/lib/constants'

type Props = {
    params: Promise<{
        type: 'ether' | 'orbital'
        atom: string
        ion: string
        term: string
    }>
}

export const dynamic = 'force-dynamic'

export default async function DataPage({ params }: Props) {
    const { atom, ion } = await params
    async function action() {
        'use server'
        return await gqlRequest(
            async () => await spectrum(parseInt(atom), parseInt(ion)),
            `${COLLECTION.SPECTRA}-${atom}-${ion}`,
        ).catch(() => [])
    }
    return <DataPageClient action={action} />
}
