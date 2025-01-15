import { Wrapper } from '@app/(public)/(wordpress)/(single)/wrapper'
import { getMetadata } from '@app/(public)/(wordpress)/(single)/util'
import { getPost } from '@src/db/mysql/getPost'
import NotFound from '@app/(public)/not-found'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export const generateMetadata = async ({ params }: Props) => {
    const { slug } = await params
    return getMetadata(slug)
}

export default async function SingleLayout({ params }: Props) {
    const { slug } = await params
    const post = await getPost(slug)
    if (!post) {
        return <NotFound />
    }
    return <Wrapper post={post} isPost={false} />
}
