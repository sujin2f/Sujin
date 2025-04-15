import { getCachedArchive } from '@app/_lib/data/mongo/wordpress/archive'
import { DAY_IN_SECONDS } from '@common/constants/datetime'
import { VERSION } from '@common/constants/helper'
import { unstable_cache } from 'next/cache'
import { formatter } from '@app/_lib/data/mongo/wordpress/category'
import { ARCHIVE_URL } from '@app/_lib/types'

export const requestArchive = async (
    type: ARCHIVE_URL,
    slug: string,
    page: number,
) =>
    unstable_cache(
        async () => {
            console.log(slug)
            return await getCachedArchive(slug, type, formatter, page)
        },
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: 0,
        },
    )()
