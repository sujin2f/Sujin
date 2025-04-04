/* Components */
import { PrevNext } from '@app/(single)/_components/PrevNext'
import PagesClient from '@app/admin/pages/[page]/PagesClient'
/* Utils */
import {
    removePage,
    updatePage,
    getPages,
} from '@app/_lib/data/mongo/wordpress/page'
/* Constants */
import { PER_PAGE } from '@app/_lib/data/mysql/constants'
/* Types */
import type { PostType } from '@app/_lib/data/mysql/types'

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

    const prev =
        page !== 1
            ? ({
                  title: 'Prev',
                  link: `/admin/pages/${page - 1}`,
              } as PostType)
            : undefined
    const next =
        pages.length === PER_PAGE
            ? ({
                  title: 'Next',
                  link: `/admin/pages/${page + 1}`,
              } as PostType)
            : undefined

    return (
        <>
            <h2>Pages</h2>
            <PagesClient pages={pages} remove={remove} refresh={refresh} />
            <PrevNext posts={[prev, next]} />
        </>
    )
}
