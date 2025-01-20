'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'

/* Components */
import { TopBar } from '@common/components/layout/TopBar'
import { Menu } from '@common/components/layout/Menu'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Hamburger } from '@components/header/Hamburger'
import { Search } from '@components/header/Search'
/* Hook */
import { useMenu } from '@src/hooks/useMenu'
/* Images */
import Logo from '@src/images/logo-top-bar.svg'
import Facebook from '@src/images/facebook.svg'
import Twitter from '@src/images/twitter.svg'
/* Assets */
import '@src/scss/fixed-header.scss'

const TOP_MENU_SCROLLED_POSITION = 80

type Props = {
    menu: string
    className?: string
}

/**
 * FixedHeader component that displays a top bar with a menu, logo, and social media links.
 * The top bar changes its appearance when the user scrolls down the page.
 *
 * @param {string} props.menu - The menu items to be displayed in the top bar.
 */
export const FixedHeader = (props: Props) => {
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
