/**
 * @todo make them one
 */
import { gql } from '@apollo/client'
import { useContext, useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Image } from 'src/types'
import { graphqlClient } from 'src/frontend/utils'
import {
    Context,
    loadBackgroundInit,
    loadBackgroundSuccess,
    setPageInfo,
} from 'src/frontend/store'
import { imageQueryNodes } from 'src/constants'

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
                            ${imageQueryNodes}
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
                icon: undefined,
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
