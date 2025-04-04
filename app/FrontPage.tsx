'use server'
import { unstable_cache } from 'next/cache'
/* Components */
import { Banner } from '@app/_components/header/Banner'
import { Header } from '@app/_components/header'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { MenuNames } from '@app/_lib/data/mysql/constants'
import { VERSION } from '@common/constants/helper'
/* Utils */
import { getCachedBackgrounds } from '@app/_lib/data/mongo/wordpress/background'
/* Assets */
import Logo from '@app/_lib/images/logo.svg'
import './front-page.scss'

export default async function FrontPage() {
    const request = unstable_cache(
        async () => await getCachedBackgrounds(),
        ['frontpage', VERSION],
        {
            tags: ['wordpress', 'page'],
            revalidate: HOUR_IN_SECONDS,
        },
    )

    const backgrounds = await request()
    const background =
        backgrounds[Math.floor(Math.random() * backgrounds.length)]

    return (
        <>
            <Header />
            <main className="page--frontpage">
                <Banner
                    menu={MenuNames.MAIN}
                    banner={{
                        title: (
                            <Logo
                                aria-label={process.env.NEXT_PUBLIC_TITLE}
                                className="banner__logo"
                            />
                        ),
                        excerpt: process.env.NEXT_PUBLIC_EXCERPT,
                        background,
                    }}
                />
            </main>
        </>
    )
}
