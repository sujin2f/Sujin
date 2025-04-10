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
import { getCachedArchive } from '@app/_lib/data/mongo/wordpress/archive'
import { updateHits } from '@app/_lib/data/mongo/wordpress/tag'
import { formatter } from '@app/_lib/data/mongo/wordpress/category'

export async function ArchiveServer({ page, type, slug }: ArchiveProp) {
    const requestArchive = unstable_cache(
        async (slug) => await getCachedArchive(slug, type, formatter, page),
        [type, slug, page.toString(), VERSION],
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
        <Wrapper
            title={title}
            excerpt={excerpt}
            prefix={type}
            background={image}
        >
            <ArchiveClient
                type={type}
                slug={slug}
                page={page}
                total={archive.total}
                posts={archive.posts!}
            />
        </Wrapper>
    )
}
