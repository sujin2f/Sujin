'use client'
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/* Components */
import { Wrapper } from '@lib/components/Wrapper'
import { Main } from '@lib/components/Main'
import FixedHeader from '@lib/components/header/FixedHeader'
import { Banner } from '@lib/components/header/Banner'
/* Utils */
import { setBackground } from '@lib/store/slices/background'
import { useServerAction } from '@lib/hooks/useServerAction'
/* Module */
import { RootState } from '@lib/store'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'
/* Assets */
import Logo from '@common/images/logo.svg'
// import style from './front-page.module.scss'

type Props = {
    readonly action: () => Promise<T_Background[]>
    readonly title: string
    readonly description: string
}

// TODO height transition start/stop
export function FrontPageClient({ action, title, description }: Props) {
    // Redux store
    const backgrounds = useSelector((state: RootState) => state.background)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!backgrounds.length, [backgrounds])
    // Read from GraphQL
    const { data } = useServerAction(action, hasStore)

    useEffect(() => {
        if (!hasStore && data && data.length) {
            dispatch(setBackground(data))
        }
    }, [data, hasStore, dispatch])

    const background = backgrounds[Math.floor(Math.random() * backgrounds.length)]

    return (
        <Wrapper>
            <FixedHeader menu={MENU_NAMES.MAIN} />

            <Main>
                <Banner
                    menu={MENU_NAMES.MAIN}
                    background={background}
                    excerpt={description}
                    title={<Logo aria-label={title} className="banner__logo" />}
                />
            </Main>
        </Wrapper>
    )
}

// <Wrapper style={style} className={style.wrapper}>
//     <FixedHeader menu={MENU_NAMES.MAIN} style={style} />

//     <Main style={style}>
//         <Banner
//             menu={MENU_NAMES.MAIN}
//             background={background}
//             style={style}
//             excerpt={description}
//             title={<Logo aria-label={title} className="banner__logo" />}
//         />
//     </Main>
// </Wrapper>
