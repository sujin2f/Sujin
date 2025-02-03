'use client'
import React, { useEffect } from 'react'

const ScrollToTop = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return <></>
}

export default ScrollToTop
