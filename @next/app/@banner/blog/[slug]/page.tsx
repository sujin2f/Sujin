/* Components */
import { Banner } from '@app/@banner/_components'
/* Utils */
import { getPost } from '@app/blog/_lib/getPost'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export default async function PostBanner(props: Props) {
    const params = await props.params
    const slug = params.slug.toLowerCase()

    const post = await getPost(slug)
    if (!post) {
        return
    }

    return (
        <Banner
            menu="primary"
            excerpt={post.excerpt}
            title={post.title}
            icon={post.images?.icon}
            background={post.images?.background}
        />
    )
}
