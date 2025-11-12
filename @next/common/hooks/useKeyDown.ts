import { useEffect } from 'react'
import type { Fn } from '@sujin/share/types'

export const useKeyDown = (key: string, cb: Fn) => {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === key) {
                cb()
            }
        }

        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [cb, key])
}
