import { notFound } from 'next/navigation'
import { Wrapper } from '@app/(wordpress)/(single)/wrapper'
import { getMetadata } from '@app/(wordpress)/(single)/util'
import { getPost } from '@src/db/mysql/getPost'

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
        notFound()
    }
    return <Wrapper post={post} isPost={false} />
}
