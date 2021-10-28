import { gql } from '@apollo/client'
import { useContext, useEffect } from 'react'

import { Context } from 'src/frontend/store'
import {
    loadBackgroundInit,
    loadBackgroundSuccess,
    setPageInfo,
} from 'src/frontend/store/actions'
import { graphqlClient } from 'src/frontend/utils'
import { isMobile } from 'src/frontend/utils/common'
import { Background } from 'src/types'

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
                wrapperClasses: {
                    'stretched-background': true,
                    'hide-footer': true,
                },
            }),
        )

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
            }),
        )
    }, [dispatch, backgrounds])
}
