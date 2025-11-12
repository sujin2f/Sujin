import type { Metadata } from 'next/types'
/* Components */
import { AboutServer } from '@app/(single)/about/About.server'
/* CONSTANTS */
import { BASE_URL } from '@lib/constants'

export const metadata: Metadata = {
    title: 'About Sujin Choi',
    openGraph: {
        title: 'About Sujin Choi',
        url: `${BASE_URL}/about`,
    },
}

export default async function AboutPage() {
    return <AboutServer />
}
