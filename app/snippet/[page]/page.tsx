import { getCachedAllSnippets } from '@app/_lib/data/mongo/snippet'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { unstable_cache } from 'next/cache'
import Table from '@common/components/containers/Table'
import Row from '../row'
import { Paging } from '@app/_components/archive/paging'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Wrapper(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    const request = unstable_cache(
        async (page) => await getCachedAllSnippets(page),
        [params.page, VERSION],
        {
            tags: ['snippet', 'common'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    const pageData = await request(page)

    return (
        <>
            <Table fullWidth className="snippet">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.snippets.map((snippet) => (
                        <Row snippet={snippet} key={snippet._id.toString()} />
                    ))}
                </tbody>
            </Table>
            <Paging pages={pageData.pages} page={page} urlPrefix="/snippet" />
        </>
    )
}
