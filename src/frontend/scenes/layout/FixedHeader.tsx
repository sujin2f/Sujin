import React from 'react'
import { Link } from 'react-router-dom'

import { TopBar } from 'src/common/components/layout/TopBar'
import { Menu } from 'src/common/components/layout/Menu'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

import { Search } from 'src/frontend/components/Search'

import { MenuNames } from 'src/constants/mysql-query'
import { useGlobalState } from 'src/frontend/hooks/global'
import { useMenu } from 'src/frontend/hooks/useMenu'

import Logo from 'src/frontend/images/logo-top-bar.svg'

require('src/frontend/scss/fixed-header.scss')

interface Props {
    isDevTool?: boolean
}

export const FixedHeader = (props: Props): JSX.Element => {
    const { wrapperClasses, setWrapperClass } = useGlobalState()
    const { menu: menuSocial } = useMenu(MenuNames.SOCIAL)
    const { menu: menuMain } = useMenu(
        props.isDevTool ? MenuNames.DEV_TOOL : MenuNames.MAIN,
    )

    return (
        <TopBar fixed fullWidth>
            {/* For Transparent Logo */}
            <section className="top-bar__background">
                <div className="top-bar__background--white" />
                <div className="top-bar__background--transparent" />
                <div className="top-bar__background--white" />
            </section>

            <Row dom="section" className="top-bar__main" fullWidth>
                <Column small={6}>
                    <button
                        className="hide-for-large top-bar__main__hamburger"
                        type="button"
                        onClick={() =>
                            setWrapperClass({
                                'wrapper--mobile-menu':
                                    !wrapperClasses['wrapper--mobile-menu'],
                            })
                        }
                    />
                    <Menu
                        className="show-for-large top-bar__menu"
                        items={menuMain || []}
                    />
                </Column>
                <Column small={6} className="hide-for-small">
                    <Search />
                    <Menu
                        className="show-for-large top-bar__manu--social-media"
                        items={menuSocial || []}
                    />
                </Column>
            </Row>

            <section className="top-bar__logo__container">
                <Link to="/" className="top-bar__logo">
                    <Logo />
                </Link>
            </section>

            <Menu
                className="hide-for-large top-bar__menu--mobile"
                items={menuMain || []}
            />
        </TopBar>
    )
}
