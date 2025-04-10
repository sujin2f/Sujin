import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
/* Components */
import ArchiveClient from '@app/_components/archive'
import Wrapper from '@app/_components/Wrapper'
/* CONSTANTS */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { ARCHIVE, type ArchiveProp } from '@app/_lib/types'
/* Utils */
import { getCachedSearchPosts } from '@app/_lib/data/mongo/wordpress/post'

export async function SearchServer({ page, slug }: ArchiveProp) {
    const requestArchive = unstable_cache(
        async (slug, page) => await getCachedSearchPosts(slug, page),
        [ARCHIVE.SEARCH, slug, page.toString(), VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: IS_DEV ? false : HOUR_IN_SECONDS,
        },
    )

    const result = await requestArchive(slug, page)
    if (!result.posts.length) notFound()

    return (
        <Wrapper title={`Search Result: ${slug}`} prefix={'Search'}>
            <ArchiveClient
                type={ARCHIVE.SEARCH}
                slug={slug}
                page={page}
                posts={result.posts}
                total={result.total}
            />
        </Wrapper>
    )
}
