/* Components */
import Link from 'next/link'
import Table from '@common/components/containers/Table'
import { Paging } from '@app/_components/archive/paging'
/* Utils */
import { getCachedRecipes } from '@app/_lib/data/mongo/recipe'

type Props = {
    page: number
    request: ReturnType<typeof getCachedRecipes>
    mine?: boolean
}

export async function ListRecipeServer({ page, mine, request }: Props) {
    const { list, pages } = await request

    return (
        <>
            <Table fullWidth>
                <thead>
                    <tr>
                        <th>Item</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((item) => (
                        <tr key={`recipe-list-${item._id.toString()}`}>
                            <td>
                                <Link href={`/recipe/item/${item._id}`}>
                                    {item.title}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Paging
                pages={pages}
                page={page}
                urlPrefix={`/recipe/${mine ? 'mine' : ''}`}
            />
        </>
    )
}
