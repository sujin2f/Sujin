import { ParamPromise } from '@app/(wordpress)/archive/[type]/[slug]/page/[page]'
import { Wrapper } from '@app/(wordpress)/archive/[type]/[slug]/page/[page]/wrapper'
import { getTermBy } from '@src/db/mysql/getTermBy'

export const generateMetadata = async ({ params }: ParamPromise) => {
    const { type, slug, page } = await params
    const term = await getTermBy(type, slug, page)
    const url = `${process.env.BASE_URL}/archive/${type}/${slug}/page/${page}`

    return {
        title: `Sujin | ${term.title}`,
        description: term.excerpt,
        // TODO
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            title: `Sujin | ${term.title}`,
            referer: url,
        },
        metadataBase: new URL(url),
    }
}

export default async function ArchiveLayout({ params }: ParamPromise) {
    const { type, slug, page } = await params
    const archive = await getTermBy(type, slug, page)
    return <Wrapper archive={archive} />
}
