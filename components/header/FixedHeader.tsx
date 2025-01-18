'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { TopBar } from '@common/components/layout/TopBar'
import { Menu } from '@common/components/layout/Menu'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Hamburger } from '@components/header/Hamburger'
import { Search } from '@components/header/Search'
import { useMenu } from '@src/hooks/useMenu'

import Logo from '@src/images/logo-top-bar.svg'
import Facebook from '@src/images/facebook.svg'
import Twitter from '@src/images/twitter.svg'

import '@src/scss/fixed-header.scss'

const TOP_MENU_SCROLLED_POSITION = 80

type Props = {
    menu: string
}

export function FixedHeader(props: Props) {
    const menu = useMenu(props.menu)
    const [scrolled, setScrolled] = useState('')

    const handleScrolled = useCallback(() => {
        if (window.scrollY > TOP_MENU_SCROLLED_POSITION && !scrolled) {
            setScrolled('scrolled')
            return
        }

        if (window.scrollY <= TOP_MENU_SCROLLED_POSITION && scrolled) {
            setScrolled('')
        }
    }, [scrolled])

    useEffect(() => {
        window.addEventListener('scroll', handleScrolled)
        return () => window.removeEventListener('scroll', handleScrolled)
    }, [handleScrolled])

    return (
        <TopBar fixed fullWidth>
            {/* For Transparent Logo */}
            <section className="top-bar__background">
                <div className="top-bar__background--white" />
                <div className="top-bar__background--transparent" />
                <div className="top-bar__background--white" />
            </section>

            <Row className="top-bar__main" dom="section">
                <Column small={6}>
                    <Hamburger menu={menu} />
                    <Menu
                        className={`show-for-large top-bar__menu__container ${scrolled}`}
                        items={menu}
                    />
                </Column>

                <Column className="hide-for-small" small={6}>
                    <Search />

                    <nav className="social-media">
                        <a
                            className="social-media--twitter"
                            href="http://twitter.com/sujin2f"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <Twitter />
                        </a>
                        <a
                            className="social-media--facebook"
                            href="https://www.facebook.com/sujin1977"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <Facebook />
                        </a>
                    </nav>
                </Column>
            </Row>

            <section className="top-bar__logo__container">
                <Link className="top-bar__logo" href="/">
                    <Logo />
                </Link>
            </section>
        </TopBar>
    )
}
