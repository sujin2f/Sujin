import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'
import ArchiveClient from '@app/(archive)/_components'
/* CONSTANTS */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { ARCHIVE } from '@app/_lib/types'
/* Utils */
import { getCachedSearchPosts } from '@app/_lib/data/mongo/wordpress/post'
/* Types */
import type { ArchiveProp } from '@app/(archive)/types'

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
        <>
            <Header />
            <main>
                <Banner title={`Search Result: ${slug}`} prefix={'Search'} />
                <ArchiveClient
                    type={ARCHIVE.SEARCH}
                    slug={slug}
                    page={page}
                    posts={result.posts}
                    total={result.total}
                />
            </main>
            <Footer />
        </>
    )
}
