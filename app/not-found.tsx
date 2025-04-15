import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { WidgetTitle } from './_components/WidgetTitle'
import { Cards } from './_components/archive/cards'
/* Utils */
import { getCachedRecentPosts } from './_lib/data/mongo/wordpress/post'
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
    const posts = await request()

    return (
        <Wrapper
            title="404 Not Found"
            excerpt="We cannot find the result. See below for recent articles."
            menu={menu}
        >
            <main>
                <Row fullWidth>
                    <Column small={12}>
                        <WidgetTitle>Recent Posts</WidgetTitle>
                        <Cards
                            posts={posts}
                            keyPrefix="not-found"
                            large={4}
                            medium={6}
                            small={12}
                        />
                    </Column>
                </Row>
            </main>
        </Wrapper>
    )
}
