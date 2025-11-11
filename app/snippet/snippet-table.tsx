import Component from '@sujin/common/components/containers/Table'
import Row from '@app/snippet/row'
import { Paging } from '@app/_components/Paging'
import { PropWithPages, T_Snippets } from '@app/_lib/types'

type Props = {
    columns?: string[]
    request: Promise<PropWithPages<T_Snippets>>
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
                    {pageData.list.map((snippet) => (
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
