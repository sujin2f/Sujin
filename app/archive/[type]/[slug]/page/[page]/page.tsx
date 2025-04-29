import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Components */
import { SearchServer } from '@app/archive/_components/Search.server'
import { ArchiveServer } from '@app/archive/_components/Archive.server'
/* CONSTANTS */
import { ARCHIVE, ARCHIVE_URL } from '@app/_lib/types'
/* Utils */
import { getMetadata } from '@app/archive/_lib/getMetadata'

type Props = {
    params: Promise<{
        type: string
        slug: string
        page: string
    }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const { type, ...params } = await props.params
    const slug = params.slug.toLowerCase()
    const page = parseInt(params.page)

    if (Object.keys(ARCHIVE_URL).includes(type)) {
        return {}
    }

    if (type === ARCHIVE_URL.SEARCH) {
        return {
            title: `Sujin | Search result | ${slug}`,
            robots: {
                index: false,
                follow: false,
                nocache: false,
            },
        }
    }

    return getMetadata({ page, type: type as ARCHIVE_URL, slug })
}

export default async function Archive(props: Props) {
    const { type, ...params } = await props.params
    const slug = params.slug.toLowerCase()
    const page = parseInt(params.page)
    if (Object.keys(ARCHIVE_URL).includes(type)) {
        notFound()
    }

    return type === ARCHIVE.SEARCH ? (
        <SearchServer page={page} slug={slug} />
    ) : (
        <ArchiveServer page={page} type={type as ARCHIVE_URL} slug={slug} />
    )
}
