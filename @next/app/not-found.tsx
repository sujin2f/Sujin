import type { Metadata } from 'next'
/* Components */
import { NotFoundClient } from '@app/not-found.client'
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

export default async function NotFound() {
    return (
        <>
            <Banner
                menu={MENU_NAMES.MAIN}
                title="404 Not Found"
                excerpt="We cannot find the result. See below for recent articles."
            />
            <NotFoundClient />
        </>
    )
}
