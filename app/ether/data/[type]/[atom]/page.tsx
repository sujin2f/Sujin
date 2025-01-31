import { findSpectra } from '@src/db/mongo/ether/spectra'
import { unstable_cache } from 'next/cache'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { Table } from './table'

export default async function DataPage() {
    const requestSpectra = unstable_cache(
        async () =>
            await findSpectra({
                ionReverse: 1,
                orbital: 's',
            }),
        ['spectra-1-s'],
        {
            tags: ['spectra'],
            revalidate: DAY_IN_SECONDS * 7,
        },
    )

    const response = await findSpectra({
        ionReverse: 1,
        orbital: 's',
    })

    // const [orbital] = getSpectra2(response)

    return (
        <Table
            items={response.map((item) => ({
                ...item,
                _id: undefined,
            }))}
        />
    )
}
