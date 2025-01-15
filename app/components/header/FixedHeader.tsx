'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

import { TopBar } from '@common/components/layout/TopBar'
import { Menu } from '@common/components/layout/Menu'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Hamburger } from '@app/components/header/Hamburger'
import { Search } from '@app/components/header/Search'
import { useMenu } from '@src/hooks/useMenu'

import Logo from '@src/images/logo-top-bar.svg'
import Facebook from '@src/images/facebook.svg'
import Twitter from '@src/images/twitter.svg'

import '@src/scss/fixed-header.scss'
import { useContext } from '@src/store'

const TOP_MENU_SCROLLED_POSITION = 80

export function FixedHeader() {
    const [{ menu: menuSlug }] = useContext()
    const { menu } = useMenu(menuSlug)
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
        document.body.addEventListener('scroll', handleScrolled)
        return () => document.body.removeEventListener('scroll', handleScrolled)
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
                    <Hamburger />

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
