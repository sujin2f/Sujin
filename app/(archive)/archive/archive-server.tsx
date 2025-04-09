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
import {
    categoryFormatter,
    getCachedArchive,
} from '@app/_lib/data/mongo/wordpress/archive'
import { updateHits } from '@app/_lib/data/mongo/wordpress/tag'
/* Types */
import type { ArchiveProp } from '@app/(archive)/types'

export async function ArchiveServer({ page, type, slug }: ArchiveProp) {
    const requestArchive = unstable_cache(
        async (slug) =>
            await getCachedArchive(slug, type, categoryFormatter, page),
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: IS_DEV ? false : HOUR_IN_SECONDS,
        },
    )
    const archive = await requestArchive(slug)
        .then((archive) => {
            if (!archive.posts || archive.posts.length === 0) {
                notFound()
            }
            return archive
        })
        .catch(() => notFound())
    const { title, excerpt, image } = archive

    // Update Tag Cloud
    if (type === ARCHIVE.TAG) {
        updateHits(slug)
    }

    return (
        <>
            <Header />
            <main>
                <Banner
                    title={title}
                    excerpt={excerpt}
                    prefix={type}
                    background={image}
                />

                <ArchiveClient
                    type={type}
                    slug={slug}
                    page={page}
                    total={archive.total}
                    posts={archive.posts!}
                />
            </main>
            <Footer />
        </>
    )
}
