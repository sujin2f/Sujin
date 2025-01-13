'use client'

import React, { useEffect } from 'react'

import { useBackground } from '@src/hooks/useBackground'
import { setBanner, setWrapperClass } from '@src/store/actions'
import { useContext } from '@src/store'

import Logo from '@src/images/logo.svg'
import '@src/scss/front-page.scss'
import { Banner } from '@src/store/type'

const bannerInfo: Banner = {
    title: (
        <Logo
            aria-label={process.env.NEXT_PUBLIC_TITLE}
            className="banner__logo"
        />
    ),
    excerpt: process.env.NEXT_PUBLIC_EXCERPT || '',
    icon: undefined,
    prefix: undefined,
    background: undefined,
    backgroundColor: undefined,
}

export default function FrontPage() {
    const [, dispatch] = useContext()
    const { background } = useBackground()

    useEffect(() => {
        dispatch(setWrapperClass('wrapper--front-page'))
        dispatch(
            setBanner({
                ...bannerInfo,
                title: (
                    <Logo
                        aria-label={process.env.NEXT_PUBLIC_TITLE}
                        className="banner__logo"
                    />
                ),
                excerpt: process.env.NEXT_PUBLIC_EXCERPT || '',
            }),
        )
    }, [dispatch])

    useEffect(() => {
        if (background && background.url) {
            dispatch(
                setBanner({
                    ...bannerInfo,
                    background,
                }),
            )
        }
    }, [background, dispatch])

    return
}
