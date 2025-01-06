import { useContext, useEffect, useRef } from 'react'
// import { TOP_MENU_SCROLLED_POSITION } from 'src/frontend/constants/common'
import { Context, ContextType } from 'src/frontend/store'
import type { WrapperClasses } from 'src/frontend/store/type'
import { TOP_MENU_SCROLLED_POSITION } from '../constants/common'
import { setWrapperClasses } from '../store/actions'

/**
 * Get wrapper HTML class name and reference on fly
 *
 * @returns {[string, RefObject<HTMLDivElement>]} Class name and <div /> reference
 */
export const useGlobalState = (...wrapperClassOverride: string[]) => {
    const [{ wrapperClasses, currentPage }, dispatch] = useContext(
        Context,
    ) as ContextType
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
                    setWrapperClasses({
                        'wrapper--scrolled': true,
                    }),
                )
            }
            if (window.scrollY <= TOP_MENU_SCROLLED_POSITION && scrolled) {
                dispatch(
                    setWrapperClasses({
                        'wrapper--scrolled': false,
                    }),
                )
            }
        }

        window.addEventListener('scroll', (): void => handleScrollChange())
    }, [])

    const returnClasses = Object.keys(wrapperClasses).filter(
        (key) => wrapperClasses[key as keyof WrapperClasses],
    )

    const classes = wrapperClassOverride.length
        ? wrapperClassOverride
        : [currentPage]
    classes.forEach((current) => {
        returnClasses.push(`wrapper--${current}`)
    })

    return {
        returnClasses: returnClasses.join(' '),
        wrapperClasses,
        wrapperElement,
    }
}
