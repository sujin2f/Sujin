import { getPost } from '@src/db/mysql/getPost'

export const getMetadata = async (
    slug: string,
    year?: number,
    month?: number,
    day?: number,
) => {
    const post = await getPost(slug)
    const pathname =
        year && month && day ? `/${year}/${month}/${day}/${slug}` : `/${slug}`
    const url = `${process.env.BASE_URL}${pathname}`

    return {
        title: `Sujin | ${post.title}`,
        description: post.excerpt,
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | ${post.title}`,
            referer: url,
        },
        metadataBase: new URL(url),
    }
}
