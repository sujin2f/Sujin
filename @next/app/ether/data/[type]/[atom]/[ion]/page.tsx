'use server'
/* Components */
import { DataPageClient } from '@app/ether/data/[type]/[atom]/[ion]/page.client'
/* Utils */
import { spectrum } from '@lib/apollo/queries/misc/spectrum'
import { redisCachedRequest } from '@lib/apollo/queries/GQLRequest'
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

export default async function DataPage({ params }: Props) {
    const { atom, ion } = await params
    async function action() {
        'use server'
        return await redisCachedRequest(async () => await spectrum(parseInt(atom), parseInt(ion)), {
            key: `${COLLECTION.SPECTRA}-${atom}-${ion}`,
        }).catch(() => [])
    }
    return <DataPageClient action={action} />
}
