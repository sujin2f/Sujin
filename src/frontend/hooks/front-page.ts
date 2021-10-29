/**
 * @todo make them one
 */
import { gql } from '@apollo/client'
import { useContext, useEffect } from 'react'

import { Background } from 'src/types'
import { graphqlClient, isMobile } from 'src/frontend/utils'
import {
    Context,
    loadBackgroundInit,
    loadBackgroundSuccess,
    setPageInfo,
} from 'src/frontend/store'

export const useBackground = (): void => {
    const [{ backgrounds }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        if (backgrounds) {
            return
        }

        dispatch(loadBackgroundInit())

        graphqlClient
            .query<{ getBackgrounds: Background[] }>({
                query: gql`
                    query {
                        getBackgrounds {
                            desktop
                            mobile
                        }
                    }
                `,
            })
            .then((response) => {
                dispatch(loadBackgroundSuccess(response.data.getBackgrounds))
            })
    }, [dispatch, backgrounds])
}

export const useFrontPage = (): void => {
    const [{ backgrounds }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        const title = window.globalVariable.title
        const description = window.globalVariable.description
        const randomBackground =
            backgrounds && backgrounds.length
                ? (backgrounds[
                      Math.floor(Math.random() * backgrounds.length)
                  ] as Background)
                : { desktop: '', mobile: '' }

        dispatch(
            setPageInfo({
                background: isMobile()
                    ? randomBackground.mobile
                    : randomBackground.desktop,
                backgroundColor: '',
                description,
                icon: '',
                isLoading: false,
                prefix: '',
                title: title.toUpperCase(),
                useBackgroundColor: false,
                wrapperClasses: {
                    'stretched-background': true,
                    'hide-footer': true,
                },
            }),
        )
    }, [dispatch, backgrounds])
}
