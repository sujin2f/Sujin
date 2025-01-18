'use client'

import React from 'react'
import { startTransition, useActionState, useEffect } from 'react'

import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { FixedHeader } from '@components/header/FixedHeader'
import fetchGQL from '@common/graphql/fetchGQL'
import { imageOpr, queryBackground } from '@src/constants/graphql'

import Logo from '@src/images/logo.svg'
import '@src/scss/front-page.scss'

export default function FrontPage() {
    const [background, setBackground] = useActionState(
        () => fetchGQL(queryBackground, imageOpr),
        undefined,
    )
    useEffect(() => {
        startTransition(() => setBackground())
    }, [])

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
                        background: background,
                        backgroundColor: undefined,
                    }}
                    className="front-page"
                />
            </main>
        </>
    )
}
