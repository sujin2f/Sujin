import React from 'react'

/* Components */
import Wrapper from '@lib/components/Wrapper'
/* Utils */
import { getBackgrounds } from '@lib/apollo/backgrounds'
/* CONSTANTS */
import { IMAGE } from '@lib/constants/graphql-fields'
/* Assets */
import Logo from '@common/images/logo.svg'
import style from '@app/front-page.module.scss'

const fields = `
    ${IMAGE}
    sizes {
        large { ${IMAGE} }
        medium { ${IMAGE} }
        mediumLarge { ${IMAGE} }
    }`

export default async function FrontPage() {
    const backgrounds = await getBackgrounds(fields).catch(() => {
        return []
    })
    const background =
        backgrounds[Math.floor(Math.random() * backgrounds.length)]

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
