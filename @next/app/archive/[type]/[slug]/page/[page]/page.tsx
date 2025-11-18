import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
/* Components */
import { SearchServer } from '@app/archive/[type]/[slug]/page/[page]/Search.server'
import { ArchiveServer } from '@app/archive/[type]/[slug]/page/[page]/Archive.server'
/* Utils */
import { cachedGQLRequest } from '@lib/apollo/queries/GQLRequest'
/* CONSTANTS */
import { ARCHIVE, COLLECTION } from '@sujin/lib/constants'
import { BASE_URL } from '@lib/constants'
import CATEGORY_QUERY from '@lib/apollo/queries/wordpress/archives/category.metadata.graphql'
import TAG_QUERY from '@lib/apollo/queries/wordpress/archives/tag.metadata.graphql'
/* T_Type */
import type { T_Archive } from '@sujin/lib/types'

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
    const archive = await cachedGQLRequest<{ archive: T_Archive[] }>(
        type === ARCHIVE.CATEGORY ? CATEGORY_QUERY : TAG_QUERY,
        { slug, type },
        [COLLECTION.ARCHIVE, type, slug, 'metadata'],
    )
        .then((result) => {
            if (!result.data || !result.data.archive.length) {
                return
            }
            return result.data.archive[0]
        })
        .catch(() => {})

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
