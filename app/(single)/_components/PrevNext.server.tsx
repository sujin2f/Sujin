import { unstable_cache } from 'next/cache'
/* Components */
import { PrevNext as Component } from '@app/(single)/_components/PrevNext'
/* Utils */
import { getCachedPrevNext } from '@app/(single)/_lib/getCachedPrevNext'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'

interface PostProps {
    slug: string
}

export const PrevNext = async ({ slug }: PostProps) => {
    const request = unstable_cache(
        async (slug) => await getCachedPrevNext(slug),
        [slug, VERSION],
        {
            tags: ['wordpress', 'post', 'prev-next'],
            revalidate,
        },
    )
    const [prev, next] = await request(slug)
    if (!prev && !next) return <></>
    return <Component prev={prev} next={next} />
}
