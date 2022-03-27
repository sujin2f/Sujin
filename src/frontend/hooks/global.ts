import { useContext, useEffect, useRef } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { RefObject } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { WrapperClasses } from 'src/types'
import { TOP_MENU_SCROLLED_POSITION } from 'src/frontend/constants/common'
import { Context, ContextType, setPageInfo } from 'src/frontend/store'

type ReturnType = [string, RefObject<HTMLDivElement>]

/**
 * Get wrapper HTML class name and reference on fly
 *
 * @returns {[string, RefObject<HTMLDivElement>]} Class name and <div /> reference
 */
export const useGlobalWrapper = (): ReturnType => {
    const [
        {
            pageInfo: { wrapperClasses, currentPage },
        },
        dispatch,
    ] = useContext(Context) as ContextType
    const wrapperElement = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScrollChange = (): void => {
            if (!wrapperElement.current) {
                return
            }

            const scrolled =
                wrapperElement.current.classList.contains('wrapper--scrolled')

            if (window.scrollY > TOP_MENU_SCROLLED_POSITION && !scrolled) {
                dispatch(
                    setPageInfo({
                        wrapperClasses: {
                            'wrapper--scrolled': true,
                        },
                    }),
                )
            }

            if (window.scrollY <= TOP_MENU_SCROLLED_POSITION && scrolled) {
                dispatch(
                    setPageInfo({
                        wrapperClasses: {
                            'wrapper--scrolled': false,
                        },
                    }),
                )
            }
        }

        window.addEventListener('scroll', (): void => handleScrollChange())
    }, [dispatch])

    const returnClasses = Object.keys(wrapperClasses).filter(
        (key) => wrapperClasses[key as keyof WrapperClasses],
    )

    if (currentPage) {
        returnClasses.push(`wrapper--${currentPage}`)
    }

    return [returnClasses.join(' '), wrapperElement]
}
