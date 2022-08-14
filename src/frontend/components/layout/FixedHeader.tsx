import React from 'react'

import { Link } from 'src/frontend/components/Link'
import { Search } from 'src/frontend/components/Search'
import { MenuNames } from 'src/constants/mysql-query'
import { useGlobalState } from 'src/frontend/hooks/global'
import { Menu } from './Menu'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

export const FixedHeader = (): JSX.Element => {
    const { wrapperClasses, setWrapperClass } = useGlobalState()

    return (
        <section>
            {/* For Transparent Logo */}
            <section className="fixed-header__background">
                <div className="fixed-header__background--white" />
                <div className="fixed-header__background--transparent" />
                <div className="fixed-header__background--white" />
            </section>

            <section className="fixed-header">
                <Row>
                    <Column small={6} className="fixed-header__section">
                        <button
                            className="hide-for-large fixed-header__hamburger"
                            type="button"
                            onClick={() =>
                                setWrapperClass({
                                    'wrapper--mobile-menu':
                                        !wrapperClasses['wrapper--mobile-menu'],
                                })
                            }
                        />
                        <Menu
                            className="show-for-large menu--fixed-header"
                            slug={MenuNames.MAIN}
                        />
                    </Column>
                    <Column
                        small={6}
                        className="hide-for-small-only fixed-header__section"
                    >
                        <Search />
                        <Menu
                            className="show-for-large fixed-header__social-media"
                            slug={MenuNames.SOCIAL}
                        />
                    </Column>
                </Row>
            </section>

            <section className="fixed-header__logo__container">
                <Link to="/" className="fixed-header__logo">
                    Sujin
                </Link>
            </section>

            <Menu
                className="hide-for-large menu--fixed-header--mobile"
                slug={MenuNames.MAIN}
            />
        </section>
    )
}
