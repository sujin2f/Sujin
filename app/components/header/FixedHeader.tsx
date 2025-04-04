'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
/* Components */
import { TopBar } from '@common/components/layout/TopBar'
import { Menu } from '@common/components/layout/Menu'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import Hamburger from '@app/components/header/Hamburger'
import Search from '@app/components/header/Search'
/* Helpers */
import { getMenu } from '@app/helpers/utils/system'
import { MenuNames } from '@app/helpers/constants/mysql-query'
import { handleSignIn, handleSignOut } from '@app/helpers/utils/auth'
/* Assets */
import Logo from '@src/images/logo-top-bar.svg'
import Facebook from '@src/images/facebook.svg'
import Twitter from '@src/images/twitter.svg'
import '@src/scss/fixed-header.scss'

const TOP_MENU_SCROLLED_POSITION = 80

type Props = {
    menu: MenuNames
    className?: string
}

/**
 * FixedHeader component that displays a top bar with a menu, logo, and social media links.
 * The top bar changes its appearance when the user scrolls down the page.
 *
 * @param {string} props.menu - The menu items to be displayed in the top bar.
 */
const FixedHeader = (props: Props) => {
    const { data: session } = useSession()
    const menu = getMenu(props.menu)
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
        <TopBar fixed fullWidth className={props.className}>
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
                        {session ? (
                            <div className="hide">
                                <h2>Welcome, {session.user?.name}!</h2>
                                <button onClick={handleSignOut}>
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleSignIn} className="hide">
                                Sign in with Google
                            </button>
                        )}
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

export default FixedHeader
