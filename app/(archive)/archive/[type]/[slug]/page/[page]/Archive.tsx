import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import ArchiveClient from '@app/(archive)/_components'
import { Header } from '@app/_components/header'
import { Footer } from '@app/_components/footer'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { ARCHIVE } from '@app/_lib/data/mysql/types'
import { MenuNames } from '@app/_lib/data/mysql/constants'
import { IS_DEV, VERSION } from '@common/constants/helper'
/* Utils */
import { getCachedCategory } from '@app/_lib/data/mongo/wordpress/category'
import { getCachedTag, updateHits } from '@app/_lib/data/mongo/wordpress/tag'
/* Types */
import type { ArchiveProp } from '@app/(archive)/types'

type Props = {
    params: Promise<ArchiveProp>
}

export default async function Archive(props: Props) {
    const params = await props.params
    const { slug, page } = params
    const type = params.type === 'tag' ? ARCHIVE.TAG : params.type
    const requestArchive = unstable_cache(
        async (slug) =>
            type === ARCHIVE.CATEGORY
                ? await getCachedCategory(slug, true)
                : await getCachedTag(slug, true),
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: IS_DEV ? false : HOUR_IN_SECONDS,
        },
    )
    const archive = await requestArchive(slug).catch(() => notFound())
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
                    menu={MenuNames.MAIN}
                    banner={{
                        title: title,
                        excerpt: excerpt,
                        prefix: type,
                        background: image,
                    }}
                />

                <ArchiveClient
                    type={type}
                    slug={slug}
                    page={page}
                    total={archive.total}
                />
            </main>
            <Footer />
        </>
    )
}
