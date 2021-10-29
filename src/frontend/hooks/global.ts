import { useContext, useEffect, useRef, RefObject } from 'react'

import { WrapperClasses } from 'src/types'
import { TOP_MENU_SCROLLED_POSITION } from 'src/frontend/constants/common'
import { Context } from 'src/frontend/store'
import { setPageInfo } from '../store/actions'

type ReturnType = [string, RefObject<HTMLDivElement>]

/**
 * Get wrapper HTML class name and reference on fly
 *
 * @returns {[string, RefObject<HTMLDivElement>]} Class name and <div /> reference
 */
export const useGlobalWrapper = (): ReturnType => {
    const [
        {
            pageInfo: { wrapperClasses },
        },
        dispatch,
    ] = useContext(Context) as Context
    const wrapperElement = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScrollChange = (): void => {
            if (!wrapperElement.current) {
                return
            }

            const scrolled = wrapperElement.current.classList.contains(
                'scrolled',
            )

            if (window.scrollY > TOP_MENU_SCROLLED_POSITION && !scrolled) {
                dispatch(
                    setPageInfo({
                        wrapperClasses: {
                            scrolled: true,
                        },
                    }),
                )
            }

            if (window.scrollY <= TOP_MENU_SCROLLED_POSITION && scrolled) {
                dispatch(
                    setPageInfo({
                        wrapperClasses: {
                            scrolled: false,
                        },
                    }),
                )
            }
        }

        window.addEventListener('scroll', (): void => handleScrollChange())
    }, [dispatch])

    return [
        Object.keys(wrapperClasses)
            .filter((key) => wrapperClasses[key as keyof WrapperClasses])
            .join(' '),
        wrapperElement,
    ]
}
