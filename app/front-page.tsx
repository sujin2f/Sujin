'use client'
/* Components */
import Wrapper from '@app/_components/Wrapper'
/* CONSTANTS */
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import GQL from '@app/api/graphql/_lib/constants'
import { Context } from '@app/_lib/constants.store'
/* Utils */
import useGQLStore from '@common/hooks/useGQLStore'
/* Assets */
import Logo from '@app/_lib/images/logo.svg'
import style from '@app/front-page.module.scss'

export function FrontPage() {
    const { items, pending, error } = useGQLStore(
        'backgrounds',
        Context,
        GQL.queryBackgrounds,
        `
        width height url mimeType
        sizes {
            medium { url width height mimeType }
            mediumLarge { url width height mimeType }
            large { url width height mimeType }
        }
        `,
        WEEK_IN_SECONDS,
    )

    const background =
        !pending && !error
            ? items[Math.floor(Math.random() * items.length)]
            : undefined

    return (
        <Wrapper
            footer={false}
            style={style}
            className={style.wrapper}
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
