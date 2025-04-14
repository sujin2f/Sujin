import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Components */
import { SearchServer } from '@app/archive/search-server'
import { ArchiveServer, getMetadata } from '@app/archive/archive-server'
/* CONSTANTS */
import { ARCHIVE, ARCHIVE_URL, type ArchiveProp } from '@app/_lib/types'

type Props = {
    params: Promise<ArchiveProp>
}

export const generateMetadata = async ({
    params,
}: Props): Promise<Metadata> => {
    // Param
    const { page, type, slug } = await params
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

    return getMetadata({ page, type, slug })
}

export default async function Page({ params }: Props) {
    const { page, type, slug: title } = await params
    const slug = title.toLowerCase()
    if (Object.keys(ARCHIVE_URL).includes(type)) {
        notFound()
    }

    return type === ARCHIVE.SEARCH ? (
        <SearchServer page={page} type={type} slug={slug} />
    ) : (
        <ArchiveServer page={page} type={type} slug={slug} />
    )
}
