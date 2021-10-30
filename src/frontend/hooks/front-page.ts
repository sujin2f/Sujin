/**
 * @todo make them one
 */
import { gql } from '@apollo/client'
import { useContext, useEffect } from 'react'

import { Image } from 'src/types'
import { graphqlClient } from 'src/frontend/utils'
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
            .query<{ getBackgrounds: Image[] }>({
                query: gql`
                    query {
                        getBackgrounds {
                            url
                            mimeType
                            sizes {
                                key
                                file
                            }
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
        const excerpt = window.globalVariable.excerpt
        const randomBackground =
            backgrounds && backgrounds.length
                ? backgrounds[Math.floor(Math.random() * backgrounds.length)]
                : undefined

        dispatch(
            setPageInfo({
                background: randomBackground,
                backgroundColor: '',
                excerpt,
                icon: '',
                isLoading: false,
                prefix: '',
                title: title.toUpperCase(),
                currentPage: 'front-page',
                wrapperClasses: {
                    'wrapper--headline': true,
                },
            }),
        )
    }, [dispatch, backgrounds])
}
