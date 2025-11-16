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
import Wrapper from '@lib/components/Wrapper'
/* Utils */
import { setBackground } from '@lib/store/slices/background'
/* Module */
import { RootState } from '@lib/store'
import { store } from '@lib/store'
import { client } from '@lib/apollo/apollo-client-frontend'
/* CONSTANTS */
import BACKGROUND_QUERY from '@lib/constants/gql/background.graphql'
/* T_Types */
import type { T_Background } from '@sujin/lib/types'
/* Assets */
import Logo from '@common/images/logo.svg'
import style from './front-page.module.scss'

// TODO height transition start/stop
const WrapperWithBackground = () => {
    // Redux store
    const backgrounds = useSelector((state: RootState) => state.background)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!backgrounds.length, [backgrounds])

    // Read from GraphQL with Intersection Observer & update store
    const { data } = useQuery<{ background: T_Background[] }>(
        BACKGROUND_QUERY,
        { skip: hasStore },
    )

    useEffect(() => {
        if (!hasStore && data && data.background.length) {
            dispatch(setBackground(data.background))
        }
    }, [data, hasStore, dispatch])

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

export default function FrontPage() {
    return (
        <ApolloProvider client={client}>
            <ReduxProvider store={store}>
                <WrapperWithBackground />
            </ReduxProvider>
        </ApolloProvider>
    )
}
