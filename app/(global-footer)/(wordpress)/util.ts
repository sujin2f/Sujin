import type { Metadata } from 'next/types'

import { Nullable } from '@common/types'
import { getPost } from '@src/db/mysql/getPost'
import { Post, Term } from '@src/types/wordpress'
import { getTermBy } from '@src/db/mysql/getTermBy'
import { cache } from 'react'

const getPostCached = cache(getPost)
const getArchiveCached = cache(getTermBy)

export const getPostParams = async (
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

export const getPageParams = async ({ params }: PageProps) => {
    const { slug } = await params
    return slug
}

export const getSingleMetadata = async (
    slug: string,
    year?: number,
    month?: number,
    day?: number,
): Promise<Metadata> => {
    const post = await getPostCached(slug).catch(() => {
        return
    })

    if (!post) {
        return {}
    }

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

export const getSinglePageData = async (
    slug: string,
    updateTagCloud = false,
): Promise<[Nullable<Post>, string]> => {
    const post = await getPostCached(slug, updateTagCloud).catch(
        () => undefined,
    )
    const thumbnail =
        (post && (post.images.list?.url || post.images.thumbnail?.url)) ||
        '/thumbnail.png'

    return [post, thumbnail]
}

export const getArchivePageData = async ({
    params,
}: ArchiveProps): Promise<Nullable<Term>> => {
    const { type, slug, page } = await params
    const archive = await getArchiveCached(type, slug, page)

    if (!archive || archive.posts.length === 0) {
        return
    }

    return archive
}
