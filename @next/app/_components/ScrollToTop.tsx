'use client'
import { type PropsWithChildren, useEffect, useState } from 'react'
// import Logger from '@sujin/share/model/Logger'

/**
 * Scroll to browser top
 * Executes once
 */
const ScrollToTop = ({ children }: PropsWithChildren) => {
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (!done) {
            window.scrollTo(0, 0)
            setDone(true)
            // Logger.dev('to top')
        }
    }, [done])

    return children
}

export default ScrollToTop
