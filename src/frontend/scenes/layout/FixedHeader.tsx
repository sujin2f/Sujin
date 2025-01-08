import React, { useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'

import { TopBar } from '@src/common/components/layout/TopBar'
import { Menu } from '@src/common/components/layout/Menu'
import { Column } from '@src/common/components/layout/Column'
import { Row } from '@src/common/components/layout/Row'
import { Context, ContextType } from '@src/frontend/store'

import { Hamburger } from '@src/frontend/scenes/layout/Hamburger'
import { Search } from '@src/frontend/scenes/layout/Search'

import { MenuNames } from '@src/constants/mysql-query'
import { useMenu } from '@src/frontend/hooks/useMenu'

import Logo from '@src/frontend/images/logo-top-bar.svg'
import Facebook from '@src/frontend/images/facebook.svg'
import Twitter from '@src/frontend/images/twitter.svg'

import '@src/frontend/scss/fixed-header.scss'
import { setWrapperClasses } from '@src/frontend/store/actions'

export function FixedHeader() {
    const [, dispatch] = useContext(Context) as ContextType
    const { menu: menuMain } = useMenu({ slug: MenuNames.MAIN })

    const mobileOnClick = useCallback(() => {
        dispatch(
            setWrapperClasses({
                'wrapper--mobile-menu': false,
            }),
        )
    }, [dispatch])

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
                        className="show-for-large top-bar__menu__container"
                        items={menuMain || []}
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
                <Link className="top-bar__logo" to="/">
                    <Logo />
                </Link>
            </section>

            <Menu
                callback={mobileOnClick}
                className="hide-for-large top-bar__menu__container--mobile"
                direction="vertical"
                items={menuMain || []}
            />
        </TopBar>
    )
}
