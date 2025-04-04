import Link from 'next/link'
/* Components */
import { PrevNext } from '@app/components/single/PrevNext'
import { Table } from '@common/components/containers/Table'
import { Button } from '@common/components/forms/Button'
/* Constants */
import { PER_PAGE } from '@src/constants/mysql-query'
/* Utils */
import {
    getBackgrounds,
    updateBackgrounds,
} from '@src/db/mongo/wordpress/background'
/* Types */
import type { PostType } from '@src/types/wordpress'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Backgrounds(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const backgrounds = await getBackgrounds()

    const prev =
        page !== 1
            ? ({
                  title: 'Prev',
                  link: `/admin/backgrounds/${page - 1}`,
              } as PostType)
            : undefined
    const next =
        backgrounds.length === PER_PAGE
            ? ({
                  title: 'Next',
                  link: `/admin/backgrounds/${page + 1}`,
              } as PostType)
            : undefined

    const refresh = async () => {
        'use server'
        await updateBackgrounds()
    }

    return (
        <>
            <h2>Backgrounds</h2>
            <div>
                <Button title="Refresh All" onClick={refresh} />
            </div>
            <article>
                <Table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>mimeType</th>
                            <th>URL</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {backgrounds.map((background) => (
                            <tr key={`admin-background-${background.url}`}>
                                <td>{background.title}</td>
                                <td>{background.mimeType}</td>
                                <td>{background.url}</td>
                                <td>
                                    <Link href={background.url} target="_blank">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </article>
            <PrevNext posts={[prev, next]} />
        </>
    )
}
