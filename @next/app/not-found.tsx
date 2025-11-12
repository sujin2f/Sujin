import type { Metadata } from 'next'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import { WidgetTitle } from '@lib/components/WidgetTitle'
import { NotFoundClient } from '@app/not-found.client'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/types'

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
    return (
        <Wrapper
            title="404 Not Found"
            excerpt="We cannot find the result. See below for recent articles."
            menu={menu}
        >
            <WidgetTitle>Recent Posts</WidgetTitle>
            <NotFoundClient />
        </Wrapper>
    )
}
