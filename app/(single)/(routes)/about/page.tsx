import type { Metadata } from 'next/types'
/* Components */
import { AboutServer } from '@app/(single)/_components/About.server'
/* CONSTANTS */
import { BASE_URL } from '@app/_lib/constants'
/* Assets */
import '@app/scss/single.scss'

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
