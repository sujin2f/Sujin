import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next/types'
/* Components */
import Blog from '@app/(single)/blog/[slug]/Blog'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { BASE_URL } from '@app/_lib/constants'
import { VERSION } from '@common/constants/helper'
import { IMAGE_SIZE } from '@app/_lib/data/mysql/types'
/* Utils */
import { getCachedPost } from '@app/_lib/data/mongo/wordpress/post'
import { getThumbnailFromPost } from '@app/_lib/data/mysql/utils'

type Props = {
    params: Promise<{
        slug: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const { slug } = await props.params
    const requestPost = unstable_cache(
        async (slug) => await getCachedPost(slug),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post'],
            revalidate: HOUR_IN_SECONDS,
        },
    )
    const post = await requestPost(slug.toLowerCase()).catch(() => null)
    if (!post) {
        return {}
    }

    const url = `${BASE_URL}/blog/${slug}`
    const images = getThumbnailFromPost(post, IMAGE_SIZE.MEDIUM_LARGE)
    const keywords = post.terms.map((term) => term.title)

    return {
        title: `Sujin | ${post.title}`,
        description: post.excerpt,
        keywords,
        openGraph: {
            title: `Sujin | ${post.title}`,
            url: url,
            images,
        },
    }
}

export default async function Page(props: Props) {
    return <Blog {...props} />
}
