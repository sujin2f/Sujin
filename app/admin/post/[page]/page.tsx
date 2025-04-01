import getPosts from '@src/db/mongo/admin/getPosts'
import PostsTable from '@components/admin/PostsTable'
import { mongoIdToString } from '@common/utils/object'
import type { Post } from '@src/types/wordpress'
import { PrevNext } from '@components/wordpress/single/PrevNext'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function AdminPosts(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const posts = await getPosts(page)

    const prev =
        page !== 1
            ? ({
                  title: 'Prev',
                  link: `/admin/post/${page - 1}`,
              } as Post)
            : undefined
    const next = {
        title: 'Next',
        link: `/admin/post/${page + 1}`,
    } as Post

    return (
        <>
            <PostsTable posts={mongoIdToString(...posts)} />
            <PrevNext posts={[prev, next]} />
        </>
    )
}
