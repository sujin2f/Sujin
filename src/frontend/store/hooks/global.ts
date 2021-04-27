/** store/hooks/global */
import axios from 'axios'
import { useContext, useEffect, useRef, RefObject } from 'react'

import { ResponseCode, PublicClasses } from 'src/frontend/constants/enum'
import { TOP_MENU_SCROLLED_POSITION } from 'src/frontend/constants/common'
import { Context } from 'src/frontend/store'
import {
    setPageHeader,
    setPublicClass,
    loadBackgroundInit,
    loadBackgroundSuccess,
    loadBackgroundFail,
} from 'src/frontend/store/actions'
import { Background } from 'src/frontend/store/items/background'
import { GlobalVariable } from 'src/frontend/store/items/global-variable'
import { log } from 'src/frontend/utils/common'

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

export const useBackground = (): void => {
    const [{ background }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        if (background) {
            return
        }

        dispatch(loadBackgroundInit())

        axios
            .get(
                'https://devbackend.sujinc.com/wp-json/sujin/v1/background/random/',
            )
            .then((response) => {
                if (response.status === ResponseCode.Success) {
                    dispatch(
                        loadBackgroundSuccess(
                            response.data.map(
                                (item: Background) => new Background(item),
                            ),
                        ),
                    )
                    return
                }
                dispatch(loadBackgroundFail())
            })
            .catch((e) => {
                log(
                    ['axios.get has been failed on background/random', e],
                    'error',
                )
                dispatch(loadBackgroundFail())
            })
    }, [dispatch, background])
}

export const useFrontPage = (): void => {
    const [{ background }, dispatch] = useContext(Context) as Context

    useEffect(() => {
        const globalVars = GlobalVariable.getInstance(window.sujin)
        const {
            title,
            description,
            frontPage,
            hideFrontFooter,
            hideFrontHeader,
        } = globalVars

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
