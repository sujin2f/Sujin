import type { Metadata } from 'next'
/* Helpers */
import NotFound from '@app/(archive)/not-found'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

export default async function Wrapper() {
    return <NotFound />
}
