/** store/hooks/global */
import { gql } from '@apollo/client'
import { useContext, useEffect, useRef, RefObject } from 'react'

import { PublicClasses } from 'src/frontend/constants/enum'
import { TOP_MENU_SCROLLED_POSITION } from 'src/frontend/constants/common'
import { Context } from 'src/frontend/store'
import {
    setPageHeader,
    setPublicClass,
    loadBackgroundInit,
    loadBackgroundSuccess,
} from 'src/frontend/store/actions'
import { Background } from 'src/types'
// import { GlobalVariable } from 'src/frontend/store/items/global-variable'
import { graphqlClient } from 'src/frontend/utils'

export const usePublicClassName = (): [string, RefObject<HTMLDivElement>] => {
    const [{ publicClass }, dispatch] = useContext(Context) as Context
    const wrapperElement = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleScrollChange() {
            if (!wrapperElement.current) {
                return
            }

            const scrolled = wrapperElement.current.classList.contains(
                'scrolled',
            )

            if (window.scrollY > TOP_MENU_SCROLLED_POSITION && !scrolled) {
                dispatch(
                    setPublicClass({
                        scrolled: true,
                    }),
                )
            }

            if (window.scrollY <= TOP_MENU_SCROLLED_POSITION && scrolled) {
                dispatch(
                    setPublicClass({
                        scrolled: false,
                    }),
                )
            }
        }

        window.addEventListener('scroll', (): void => handleScrollChange())
    }, [dispatch])

    return [
        Object.keys(publicClass)
            .filter((key) => publicClass[key as PublicClasses])
            .join(' '),
        wrapperElement,
    ]
}

type Response = {
    getBackgrounds: Background[]
}

export const useBackground = (): void => {
    const [{ background }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        if (background) {
            return
        }

        dispatch(loadBackgroundInit())

        graphqlClient
            .query<Response>({
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
    }, [dispatch, background])
}

export const useFrontPage = (): void => {
    const [{ background }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        // const globalVars = GlobalVariable.getInstance(window.sujin)
        // TODO
        const title = window.globalVariable.title
        const description = window.globalVariable.description
        const frontPage = 'front-page'
        const hideFrontFooter = true
        const hideFrontHeader = true

        if (frontPage === 'front-page') {
            dispatch(
                setPublicClass({
                    'stretched-background': true,
                    'hide-footer': true,
                    'hide-header': false,
                }),
            )

            dispatch(
                setPageHeader({
                    background,
                    backgroundColor: '',
                    description,
                    icon: '',
                    isLoading: false,
                    prefix: '',
                    title: title.toUpperCase(),
                    useBackgroundColor: false,
                }),
            )
        } else {
            if (hideFrontFooter) {
                dispatch(
                    setPublicClass({
                        'hide-footer': true,
                    }),
                )
            }

            if (hideFrontHeader) {
                dispatch(
                    setPublicClass({
                        'hide-header': true,
                    }),
                )
            }
        }
    }, [dispatch, background])
}
