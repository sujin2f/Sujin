import { useEffect, useRef } from 'react'
import { Fn } from '../types'

export const useDocumentClick = <T extends HTMLElement>(callback: Fn) => {
    const ref = useRef<T>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [callback])

    return ref
}
