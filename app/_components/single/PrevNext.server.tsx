import { unstable_cache } from 'next/cache'
/* Components */
import { PrevNext as Component } from '@app/_components/single/PrevNext'
/* Utils */
import { getCachedPrevNext } from '@app/_lib/data/mongo/wordpress/post'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'

interface PostProps {
    slug: string
}

export const PrevNext = async ({ slug }: PostProps) => {
    const request = unstable_cache(
        async (slug) => await getCachedPrevNext(slug),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post', 'prev-next'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )
    const [prev, next] = await request(slug)
    if (!prev && !next) return <></>
    return <Component prev={prev} next={next} />
}
