'use client'

import React from 'react'
import { useEffect } from 'react'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { FixedHeader } from '@components/header/FixedHeader'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { imageOpr, queryBackground } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'

import Logo from '@src/images/logo.svg'
import '@src/scss/front-page.scss'
import { useGlobalState } from '@common/hooks/useGlobalState'
import { Image } from '@src/types/wordpress'

export default function FrontPage() {
    const [backgrounds, setBackgrounds] = useGlobalState<Image[] | boolean>(
        'backgrounds',
        false,
    )
    useEffect(() => {
        if (!backgrounds) {
            setBackgrounds(true) // Prevent fetching again
            const fetchBackgrounds = async () => {
                const response = await fetchGQL(
                    queryBackground,
                    imageOpr,
                    WEEK_IN_SECONDS,
                ).catch(() => false)
                setBackgrounds(response)
            }
            fetchBackgrounds()
        }
    }, [backgrounds, setBackgrounds])

    const background = Array.isArray(backgrounds)
        ? backgrounds[Math.floor(Math.random() * backgrounds.length)]
        : undefined

    return (
        <>
            <FixedHeader menu={MenuNames.MAIN} />
            <main>
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
                        icon: undefined,
                        prefix: undefined,
                        background,
                        backgroundColor: undefined,
                    }}
                    className="front-page"
                />
            </main>
        </>
    )
}
