'use client'

import React, { useState } from 'react'
import { useEffect } from 'react'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { imageOpr, queryBackground } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import type { Image } from '@src/types/wordpress'

import Logo from '@src/images/logo.svg'
import '@src/scss/front-page.scss'

export default function FrontPage() {
    const [backgrounds, setBackgrounds] = useState<Image[]>([])
    useEffect(() => {
        fetchGQL(queryBackground, imageOpr, WEEK_IN_SECONDS).then((result) =>
            setBackgrounds(result),
        )
    }, [])

    const background = Array.isArray(backgrounds)
        ? backgrounds[Math.floor(Math.random() * backgrounds.length)]
        : undefined

    return (
        <main className="page--frontpage">
            <Banner
                menu={MenuNames.MAIN}
                banner={{
                    title: (
                        <Logo
                            aria-label={process.env.NEXT_PUBLIC_TITLE}
                            className="banner__logo"
                        />
                    ),
                    excerpt: process.env.NEXT_PUBLIC_EXCERPT || '',
                    background,
                }}
            />
        </main>
    )
}
