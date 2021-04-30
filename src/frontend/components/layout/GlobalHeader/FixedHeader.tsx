/*
 * Global Header > Fixed Header Component
 * components/layout/GlobalHeader/FixedHeader
 */

import React, { useContext } from 'react'

import { Link } from 'src/frontend/components/common/Link'
import { Search } from 'src/frontend/components/layout/Search'
import { Menu } from 'src/frontend/components/layout/Menu'
import { Context } from 'src/frontend/store'
import { setPublicClass } from 'src/frontend/store/actions'

export const FixedHeader = (): JSX.Element => {
    const [{ publicClass }, dispatch] = useContext(Context) as Context

    return (
        <section className="layout__header__fixed">
            {/* For Transparent Logo */}
            <section className="flex-row fixed-nav">
                <div className="section" />
                <div className="section center" />
                <div className="section" />
            </section>

            <section className="fixed-nav">
                <div className="row">
                    <section className="columns small-6">
                        <button
                            className="hide-for-large icon hamburger"
                            data-testid="hamburger"
                            type="button"
                            onClick={() =>
                                dispatch(
                                    setPublicClass({
                                        'mobile-menu': !publicClass[
                                            'mobile-menu'
                                        ],
                                    }),
                                )
                            }
                        />
                        <Menu
                            className="show-for-large menu__fixed__primary"
                            slug="main-menu"
                        />
                    </section>
                    <section className="columns small-6 hide-for-small-only">
                        <Search />
                        <Menu
                            className="show-for-large menu__fixed__social-media"
                            slug="social-media"
                        />
                    </section>
                </div>
            </section>

            <section className="logo-container">
                <Link to="/" className="icon logo reverse">
                    Sujin
                </Link>
            </section>

            <Menu
                className="hide-for-large menu__fixed__primary-mobile"
                slug="main-menu"
            />
        </section>
    )
}
