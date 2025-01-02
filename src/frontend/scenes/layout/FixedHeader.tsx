import React, { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'

import { TopBar } from 'src/common/components/layout/TopBar'
import { Menu } from 'src/common/components/layout/Menu'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { Context, ContextType } from 'src/frontend/store'
import { setPageInfo } from 'src/frontend/store/actions'

import { Hamburger } from 'src/frontend/scenes/layout/Hamburger'
import { Search } from 'src/frontend/scenes/layout/Search'

import { MenuNames } from 'src/constants/mysql-query'
import { useMenu } from 'src/frontend/hooks/useMenu'

import Logo from 'src/frontend/images/logo-top-bar.svg'
import Facebook from 'src/frontend/images/facebook.svg'
import Twitter from 'src/frontend/images/twitter.svg'

require('src/frontend/scss/fixed-header.scss')

export const FixedHeader = (): JSX.Element => {
    const [{ wrapperClasses }, dispatch] = useContext(Context) as ContextType
    const { menu: menuMain } = useMenu(MenuNames.MAIN)

    const mobileOnClick = useCallback(() => {
        dispatch(
            setPageInfo({
                wrapperClasses: {
                    ...wrapperClasses,
                    'wrapper--mobile-menu': false,
                },
            }),
        )
    }, [dispatch, wrapperClasses])

    return (
        <TopBar fixed fullWidth>
            {/* For Transparent Logo */}
            <section className="top-bar__background">
                <div className="top-bar__background--white" />
                <div className="top-bar__background--transparent" />
                <div className="top-bar__background--white" />
            </section>

            <Row dom="section" className="top-bar__main">
                <Column small={6}>
                    <Hamburger />
                    <Menu
                        className="show-for-large top-bar__menu__container"
                        items={menuMain || []}
                    />
                </Column>
                <Column small={6} className="hide-for-small">
                    <Search />
                    <nav className="social-media">
                        <a
                            href="http://twitter.com/sujin2f"
                            className="social-media--twitter"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Twitter />
                        </a>
                        <a
                            href="https://www.facebook.com/sujin1977"
                            className="social-media--facebook"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Facebook />
                        </a>
                    </nav>
                </Column>
            </Row>

            <section className="top-bar__logo__container">
                <Link to="/" className="top-bar__logo">
                    <Logo />
                </Link>
            </section>

            <Menu
                className="hide-for-large top-bar__menu__container--mobile"
                items={menuMain || []}
                direction="vertical"
                callback={mobileOnClick}
            />
        </TopBar>
    )
}
