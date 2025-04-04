import type { Metadata } from 'next/types'
/* Components */
import { About } from '@app/(single)/about/About'
/* Constants */
import { BASE_URL } from '@app/_lib/constants'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${BASE_URL}/about`,
    },
    metadataBase: new URL(`${BASE_URL}/about`),
}

export default async function Page() {
    return <About />
}
