import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Components */
import { SearchServer } from '@app/archive/[type]/[slug]/page/[page]/Search.server'
import { ArchiveServer } from '@app/archive/[type]/[slug]/page/[page]/Archive.server'
/* Utils */
import { getArchive } from '@lib/apollo/query/getArchive'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
import { BASE_URL } from '@lib/constants'

type Props = {
    params: Promise<{
        type: string
        slug: string
        page: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params
    const slug = params.slug.toLowerCase()
    const page = parseInt(params.page)
    const type = params.type as ARCHIVE

    if (Object.keys(ARCHIVE).includes(type)) {
        return {}
    }

    if (type === ARCHIVE.SEARCH) {
        return {
            title: `Sujin | Search result | ${slug}`,
            robots: {
                index: false,
                follow: false,
                nocache: false,
            },
        }
    }

    // TODO thumbnail
    const archive = await getArchive(slug, type, 'ARCHIVE_META').catch(() => {})
    if (!archive) {
        return {
            robots: {
                index: false,
                follow: false,
                nocache: false,
            },
        }
    }
    const url = `${BASE_URL}/archive/${type}/${slug}/page/${page}`

    return {
        title: `Sujin | ${archive.title}`,
        description: archive.excerpt,
        openGraph: {
            title: `Sujin | ${archive.title}`,
            url: url,
        },
    }
}

export default async function Archive(props: Props) {
    const params = await props.params
    const slug = params.slug.toLowerCase()
    const page = parseInt(params.page)
    const type = params.type as ARCHIVE
    if (Object.keys(ARCHIVE).includes(type)) {
        notFound()
    }

    return type === ARCHIVE.SEARCH ? (
        <SearchServer page={page} slug={slug} />
    ) : (
        <ArchiveServer page={page} type={type} slug={slug} />
    )
}
