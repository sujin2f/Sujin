import { notFound } from 'next/navigation'
/* Models */
import { Logger } from '@sujin/share/model/Logger'
/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES, POST_STATUS } from '@sujin/lib/constants'
import { getPost } from '@app/blog/_lib/getPost'
/* Utils */
import { publish } from '@app/_lib/redis'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export default async function PostBanner(props: Props) {
    const params = await props.params
    const slug = params.slug.toLowerCase()

    const post = await getPost(slug)
        .then((result) => {
            if (!result.slug) {
                throw new Error(`🤬 Post ${slug} request has been failed: No-content.`)
            }
            return result
        })
        .catch((e) => {
            Logger.error(e.message)
            notFound()
        })
    const tags = post.archives.filter((tag) => tag.type === 'tag')

    const slugs: string[] = []
    if (tags.length && post.status === POST_STATUS.PUBLISH) {
        tags.forEach((tag) => slugs.push(tag.slug))
    }
    if (slug.length) {
        publish('update-hits', slugs)
    }

    return (
        <Banner
            menu={MENU_NAMES.MAIN}
            excerpt={post.excerpt}
            title={post.title}
            icon={post.images?.icon}
            background={post.images?.background}
        />
    )
}
