'use client'
import React, { useEffect, useState } from 'react'
import Logger from '../model/Logger'

/**
 * Scroll to browser top
 * Executes once
 */
const ScrollToTop = () => {
    const [done, setDone] = useState(false)

    useEffect(() => {
        if (!done) {
            window.scrollTo(0, 0)
            setDone(true)
            Logger.dev('to top')
        }
    }, [done])

    return <></>
}

export default ScrollToTop
