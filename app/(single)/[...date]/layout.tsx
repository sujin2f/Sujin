import { getPost } from '@src/db/mysql/getPost'
import { PropsWithChildren } from 'react'
import { ParamPromise } from '.'

export const generateMetadata = async ({ params }: ParamPromise) => {
    const {
        date: [year, month, day, slug],
    } = await params

    const post = await getPost(slug)

    if (!post) {
        return {}
    }

    const url = `http://sujinc.com/${year}/${month}/${day}/${slug}`

    return {
        title: `Sujin | ${post.title}`,
        description: post.excerpt,
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | ${post.title}`,
            url,
        },
        metadataBase: new URL(url),
    }
}

export default function PostLayout({ children }: PropsWithChildren) {
    return children
}
