import getPosts from '@src/db/mongo/admin/getPosts'
import PostsTable from '@components/admin/PostsTable'
import { mongoIdToString } from '@common/utils/object'
import Link from 'next/link'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function AdminPost(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const posts = await getPosts(page)
    return (
        <>
            <PostsTable posts={mongoIdToString(...posts)} />
            <nav>
                <ul>
                    {page !== 1 && (
                        <li>
                            <Link href={`/admin/post/${page - 1}`}>Prev</Link>
                        </li>
                    )}
                    <li>
                        <Link href={`/admin/post/${page + 1}`}>Next</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}
