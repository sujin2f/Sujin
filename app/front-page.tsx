'use server'
import { unstable_cache } from 'next/cache'
import type { WithoutId } from 'mongodb'
/* Components */
import Wrapper from '@app/_components/Wrapper'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { COLLECTION } from '@app/_lib/types'
import { revalidate } from '@app/_lib/constants'
/* Utils */
import { cachedRequest } from '@app/_lib/utils/cache'
import { getCollection } from '@common/data/mongo/mongo'
/* T_Types */
import type { T_Background } from '@app/_lib/types'
/* Assets */
import Logo from '@app/_lib/images/logo.svg'
import '@app/front-page.scss'

export async function FrontPage() {
    const request = unstable_cache(
        async () => await getCachedBackgrounds(),
        ['frontpage', VERSION],
        {
            tags: ['wordpress', 'page'],
            revalidate,
        },
    )

    const backgrounds = await request().catch(() => [])
    const background =
        backgrounds[Math.floor(Math.random() * backgrounds.length)]

    return (
        <Wrapper
            footer={false}
            className="sujin wrapper--frontpage"
            title={
                <Logo
                    aria-label={process.env.NEXT_PUBLIC_TITLE}
                    className="banner__logo"
                />
            }
            excerpt={process.env.NEXT_PUBLIC_EXCERPT}
            background={background}
        />
    )
}

/**
 * Get backgrounds
 * This returns the cached result if it exists
 *
 * @returns {Promise<WithoutId<T_Background>[]>} - The background array
 */
const getCachedBackgrounds = async (): Promise<WithoutId<T_Background>[]> =>
    await cachedRequest(COLLECTION.BACKGROUNDS, [], async () => {
        const collection = await getCollection<T_Background>(
            COLLECTION.BACKGROUNDS,
        )
        return await collection
            .aggregate<T_Background>([{ $sample: { size: 10 } }])
            .project<WithoutId<T_Background>>({ _id: 0 })
            .toArray()
    })
