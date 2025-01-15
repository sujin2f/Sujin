'use client'

import React, { useEffect } from 'react'

import { useBackground } from '@src/hooks/useBackground'
import { setBanner, setMenu, setWrapperClass } from '@src/store/actions'
import { useContext } from '@src/store'
import { MenuNames } from '@src/constants/mysql-query'
import type { Banner as BannerType } from '@src/store/type'

import { Banner } from '@app/components/header/Banner'
import { FixedHeader } from '@app/components/header/FixedHeader'

import Logo from '@src/images/logo.svg'
import '@src/scss/front-page.scss'

const bannerInfo: BannerType = {
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
        dispatch(setBanner(bannerInfo))
        dispatch(setMenu(MenuNames.MAIN))
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

    return (
        <div className="wrapper wrapper--front-page">
            <FixedHeader />
            <main>
                <Banner />
            </main>
        </div>
    )
}
