'use client'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

/* Components */
import Wrapper from '@lib/components/Wrapper'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'
/* Assets */
import Logo from '@common/images/logo.svg'
import style from '@app/front-page.module.scss'

const GET_BACKGROUNDS = gql`
    query backgrounds {
        backgrounds {
            url
            width
            height
            sizes {
                large {
                    height
                    mimeType
                    url
                }
                medium {
                    height
                    mimeType
                    url
                }
                mediumLarge {
                    height
                    mimeType
                    url
                }
            }
        }
    }
`

export function FrontPageBackground() {
    const { data } = useQuery<{ backgrounds: T_Background[] }>(GET_BACKGROUNDS)

    let backgrounds: T_Background[] = []
    if (data) {
        backgrounds = data.backgrounds
    }
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
