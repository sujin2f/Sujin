import getPages from '@src/db/mongo/admin/getPages'
import PostsTable from '@components/admin/PostsTable'
import { mongoIdToString } from '@common/utils/object'
import type { Post } from '@src/types/wordpress'
import { PrevNext } from '@components/wordpress/single/PrevNext'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function AdminPages(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const pages = await getPages(page)

    const prev =
        page !== 1
            ? ({
                  title: 'Prev',
                  link: `/admin/page/${page - 1}`,
              } as Post)
            : undefined
    const next = {
        title: 'Next',
        link: `/admin/page/${page + 1}`,
    } as Post

    return (
        <>
            <PostsTable posts={mongoIdToString(...pages)} />
            <PrevNext posts={[prev, next]} />
        </>
    )
}
