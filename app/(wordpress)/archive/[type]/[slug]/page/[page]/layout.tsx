import { ParamPromise } from '@app/(wordpress)/archive/[type]/[slug]/page/[page]'
import { Wrapper } from '@app/(wordpress)/archive/[type]/[slug]/page/[page]/wrapper'
import { getTermBy } from '@src/db/mysql/getTermBy'
import { notFound } from 'next/navigation'

export const generateMetadata = async ({ params }: ParamPromise) => {
    const { type, slug, page } = await params
    const archive = await getTermBy(type, slug, page)
    if (!archive || archive.posts.length === 0) {
        return {}
    }
    const url = `${process.env.BASE_URL}/archive/${type}/${slug}/page/${page}`

    return {
        title: `Sujin | ${archive.title}`,
        description: archive.excerpt,
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | ${archive.title}`,
            referer: url,
        },
        metadataBase: new URL(url),
    }
}

export default async function ArchiveLayout({ params }: ParamPromise) {
    const { type, slug, page } = await params
    const archive = await getTermBy(type, slug, page)
    if (!archive || archive.posts.length === 0) {
        notFound()
    }
    return <Wrapper archive={archive} />
}
