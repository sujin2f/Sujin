import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import { WidgetTitle } from '@app/_components/WidgetTitle'
import { CardsServer } from '@app/archive/_components/Cards.server'
import { Loading } from '@app/archive/_components/Loading'
/* Utils */
import { getCachedRecentPosts } from '@app/(single)/_lib/getCachedRecentPosts'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'
import { IS_DEV, VERSION } from '@common/constants/helper'
import { HOUR_IN_SECONDS } from '@common/constants/datetime'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

type Props = {
    readonly menu?: MENU_NAMES
}

export default async function NotFound({ menu }: Props) {
    const request = unstable_cache(
        async () => await getCachedRecentPosts(),
        [VERSION],
        {
            tags: ['wordpress', 'post', 'recent-posts'],
            revalidate: IS_DEV ? 1 : HOUR_IN_SECONDS,
        },
    )

    return (
        <Wrapper
            title="404 Not Found"
            excerpt="We cannot find the result. See below for recent articles."
            menu={menu}
            className="wrapper--not-found sujin"
        >
            <main>
                <WidgetTitle>Recent Posts</WidgetTitle>
                <Suspense fallback={<Loading />}>
                    <CardsServer
                        posts={request()}
                        keyPrefix="not-found"
                        large={4}
                        medium={6}
                        small={12}
                    />
                </Suspense>
            </main>
        </Wrapper>
    )
}
