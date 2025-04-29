'use server'
import { unstable_cache } from 'next/cache'
/* Components */
import Wrapper from '@app/_components/Wrapper'
/* CONSTANTS */
import { VERSION } from '@common/constants/helper'
import { revalidate } from '@app/_lib/constants'
/* Utils */
import { getCachedBackgrounds } from '@app/_lib/data/mongo/background'
/* Assets */
import Logo from '@app/_lib/images/logo.svg'
import '@app/scss/front-page.scss'

export async function FrontPage() {
    const request = unstable_cache(
        async () => await getCachedBackgrounds(),
        ['frontpage', VERSION],
        {
            tags: ['wordpress', 'page'],
            revalidate,
        },
    )

    const backgrounds = await request().catch(() => [])
    const background =
        backgrounds[Math.floor(Math.random() * backgrounds.length)]

    return (
        <Wrapper
            footer={false}
            className="sujin wrapper--frontpage"
            title={
                <Logo
                    aria-label={process.env.NEXT_PUBLIC_TITLE}
                    className="banner__logo"
                />
            }
            excerpt={process.env.NEXT_PUBLIC_EXCERPT}
            background={background}
        />
    )
}
