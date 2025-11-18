'use client'
import React, { useEffect, useMemo } from 'react'
import {
    Provider as ReduxProvider,
    useDispatch,
    useSelector,
} from 'react-redux'
import { ApolloProvider } from '@apollo/client/react'
import { useQuery } from '@apollo/client/react'
/* Components */
import { WrapperNew } from '@lib/components/WrapperNew'
import { Main } from '@lib/components/Main'
import FixedHeader from '@lib/components/header/FixedHeader'
import { Banner } from '@lib/components/header/Banner'
/* Utils */
import { setBackground } from '@lib/store/slices/background'
/* Module */
import { RootState } from '@lib/store'
import { store } from '@lib/store'
import { client } from '@lib/apollo/apollo-client-frontend'
/* CONSTANTS */
import LIST_QUERY from '@lib/apollo/queries/wordpress/backgrounds/backgrounds.graphql'
import { MENU_NAMES } from '@sujin/lib/constants'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'
/* Assets */
import Logo from '@common/images/logo.svg'
import style from './front-page.module.scss'

export default function FrontPage() {
    return (
        <ApolloProvider client={client}>
            <ReduxProvider store={store}>
                <WrapperWithBackground />
            </ReduxProvider>
        </ApolloProvider>
    )
}

// TODO height transition start/stop
const WrapperWithBackground = () => {
    // Redux store
    const backgrounds = useSelector((state: RootState) => state.background)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!backgrounds.length, [backgrounds])

    // Read from GraphQL with Intersection Observer & update store
    const { data } = useQuery<{ backgrounds: T_Background[] }>(LIST_QUERY, {
        skip: hasStore,
    })

    useEffect(() => {
        if (!hasStore && data && data.backgrounds.length) {
            dispatch(setBackground(data.backgrounds))
        }
    }, [data, hasStore, dispatch])

    const background =
        backgrounds[Math.floor(Math.random() * backgrounds.length)]

    return (
        <WrapperNew style={style} className={style.wrapper}>
            <FixedHeader menu={MENU_NAMES.MAIN} style={style} />

            <Main style={style}>
                <Banner
                    menu={MENU_NAMES.MAIN}
                    background={background}
                    style={style}
                    excerpt={process.env.NEXT_PUBLIC_EXCERPT}
                    title={
                        <Logo
                            aria-label={process.env.NEXT_PUBLIC_TITLE}
                            className="banner__logo"
                        />
                    }
                />
            </Main>
        </WrapperNew>
    )
}
