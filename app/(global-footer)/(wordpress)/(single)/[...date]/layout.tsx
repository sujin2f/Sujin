import { cache, PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { redirect } from 'next/navigation'
import { getPost } from '@src/db/mongo/wordpress/post'
import { updateHit } from '@src/db/mysql/getTagCloud'
import { removeId } from '@src/db/mongo/util'
import { Post } from '@components/(wordpress)/single/Post'

const getPostParams = async (
    params: Promise<{
        date: string[]
    }>,
): Promise<false | [number, number, number, string]> => {
    const { date } = await params
    if (date.length !== 4) {
        return false
    }
    const year = parseInt(date[0])
    const month = parseInt(date[1])
    const day = parseInt(date[2])
    const slug = date[3]

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return false
    }

    return [year, month, day, slug]
}

const getPostCached = cache(async (slug: string) => await getPost(slug))

export const generateMetadata = async (props: PostProps): Promise<Metadata> => {
    const params = await getPostParams(props.params)
    if (!params) {
        return {}
    }
    const [year, month, day, slug] = params
    const post = await getPostCached(slug)
    const pathname =
        year && month && day ? `/${year}/${month}/${day}/${slug}` : `/${slug}`
    const url = `${process.env.BASE_URL}${pathname}`
    const images =
        post.images.thumbnail?.url ||
        post.images.list?.url ||
        `${process.env.BASE_URL}/thumbnail.png`

    return {
        title: `Sujin | ${post.title}`,
        description: post.excerpt,
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | ${post.title}`,
            url: url,
            images,
        },
        metadataBase: new URL(url),
    }
}

export default async function Layout(props: PropsWithChildren<PostProps>) {
    const params = await getPostParams(props.params)
    if (!params) {
        redirect('/404')
    }
    const [, , , slug] = params
    const post = await getPostCached(slug)

    if (!post) {
        redirect('/404')
    }

    const thumbnail =
        (post && (post.images.list?.url || post.images.thumbnail?.url)) ||
        '/thumbnail.png'

    // Update Tag Cloud
    if (post.tags.length) {
        post.tags.forEach((tag) => updateHit(tag.id))
    }
    return (
        <>
            <Banner
                menu={MenuNames.MAIN}
                banner={{
                    title: post.title,
                    excerpt: post.excerpt,
                    icon: post.images.icon,
                    prefix: undefined,
                    background: post.images.background,
                    backgroundColor: post.meta.backgroundColor,
                }}
                className=""
            />
            <Post post={removeId(post)} thumbnail={thumbnail} />
        </>
    )
}
