'use client'

import { type RefObject, useEffect } from 'react'

/**
 * Hook that observes an element and calls a callback when it becomes visible.
 * @param {RefObject<HTMLElement | null>} ref - The reference to the element to observe.
 * @param {() => void} callback - The callback to call when the element becomes visible.
 * @returns {void}
 */
const useIntersectionObserver = (
    ref: RefObject<HTMLElement | null>,
    callback: () => void,
): void => {
    useEffect(() => {
        if (!ref || !ref.current) {
            return
        }
        const current = ref.current
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        callback()
                    }
                })
            },
            {
                threshold: 0.9,
            },
        )
        if (current) {
            observer.observe(current)
        }

        // Destroy the observer when the component is unmounted.
        return () => {
            if (current) {
                observer.unobserve(current)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref])
}

export default useIntersectionObserver
