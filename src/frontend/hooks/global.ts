import { useContext, useEffect, useRef } from 'react'
import { WrapperClasses } from 'src/types/store'
import { TOP_MENU_SCROLLED_POSITION } from 'src/frontend/constants/common'
import { Context, ContextType } from 'src/frontend/store'
import { setPageInfo } from 'src/frontend/store/actions'

/**
 * Get wrapper HTML class name and reference on fly
 *
 * @returns {[string, RefObject<HTMLDivElement>]} Class name and <div /> reference
 */
export const useGlobalState = () => {
    const [options, dispatch] = useContext(Context) as ContextType
    const wrapperElement = useRef<HTMLDivElement>(null)
    const { wrapperClasses, currentPage } = options

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
    const setWrapperClass = (value: Partial<WrapperClasses>) => {
        dispatch(
            setPageInfo({
                wrapperClasses: value,
            }),
        )
    }

    return {
        returnClasses: returnClasses.join(' '),
        wrapperClasses,
        setWrapperClass,
        wrapperElement,
        background: options.background,
        backgroundColor: options.backgroundColor,
        excerpt: options.excerpt,
        icon: options.icon,
        isLoading: options.isLoading,
        prefix: options.prefix,
        title: options.title,
    }
}
