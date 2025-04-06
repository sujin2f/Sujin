/* Components */
import { PrevNext } from '@app/admin/_components/PrevNext'
import { PagesTable } from '@app/admin/pages/PagesTable'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Header } from './Header'
/* Utils */
import {
    removePage,
    updatePage,
    getPages,
} from '@app/_lib/data/mongo/wordpress/page'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Pages(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const pages = await getPages(page)
    const remove = async (slug: string) => {
        'use server'
        await removePage(slug)
    }
    const refresh = async (slug: string) => {
        'use server'
        await updatePage(slug)
    }

    return (
        <>
            <Header refresh={refresh} />
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PagesTable
                        pages={pages}
                        remove={remove}
                        refresh={refresh}
                    />
                </Column>
                <Column small={12}>
                    <PrevNext page={page} length={pages.length} path="pages" />
                </Column>
            </Row>
        </>
    )
}
