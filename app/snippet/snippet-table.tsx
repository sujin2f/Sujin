import Component from '@common/components/containers/Table'
import Row from '@app/snippet/row'
import { Paging } from '@app/_components/archive/paging'
import { SnippetsProp } from '@app/_lib/types'

type Props = {
    columns?: string[]
    request: Promise<SnippetsProp>
    page: number
    userId?: string
}

export async function Table({
    request,
    page,
    columns = ['title', 'tags'],
    userId,
}: Props) {
    const pageData = await request

    return (
        <>
            <Component fullWidth className="snippet">
                <thead>
                    <tr>
                        {columns.includes('title') && <th>Title</th>}
                        {columns.includes('tags') && <th>Tags</th>}
                        {columns.includes('import') && <th>Import</th>}
                    </tr>
                </thead>
                <tbody>
                    {pageData.snippets.map((snippet) => (
                        <Row
                            snippet={snippet}
                            key={snippet._id.toString()}
                            columns={columns}
                            userId={userId}
                        />
                    ))}
                </tbody>
            </Component>
            <Paging pages={pageData.pages} page={page} urlPrefix="/snippet" />
        </>
    )
}
