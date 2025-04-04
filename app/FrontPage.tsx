'use server'
import { unstable_cache } from 'next/cache'
/* Components */
import Banner from '@app/components/header/Banner'
import Header from '@app/components/header'
/* Constants */
import { HOUR_IN_SECONDS } from '@common/constants/datetime'
import { MenuNames } from '@app/helpers/constants/mysql-query'
import { VERSION } from '@common/constants/helper'
/* Utils */
import { getCachedBackgrounds } from '@app/helpers/data/mongo/wordpress/background'
/* Assets */
import Logo from '@src/images/logo.svg'
import '@src/scss/front-page.scss'

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
