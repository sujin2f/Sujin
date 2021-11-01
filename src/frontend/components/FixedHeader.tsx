/*
 * Global Header > Fixed Header Component
 * components/layout/GlobalHeader/FixedHeader
 */

import React, { useContext } from 'react'

import { Link, Search, Menu } from 'src/frontend/components'
import { Context } from 'src/frontend/store'
import { setPageInfo } from 'src/frontend/store/actions'
import { MenuNames } from 'src/constants'

export const FixedHeader = (): JSX.Element => {
    const [
        {
            pageInfo: { wrapperClasses },
        },
        dispatch,
    ] = useContext(Context) as Context

    return (
        <section>
            {/* For Transparent Logo */}
            <section className="fixed-header__background">
                <div className="fixed-header__background--white" />
                <div className="fixed-header__background--transparent" />
                <div className="fixed-header__background--white" />
            </section>

            <section className="fixed-header">
                <div className="row">
                    <section className="columns small-6 fixed-header__section">
                        <button
                            className="hide-for-large fixed-header__hamburger"
                            type="button"
                            onClick={() =>
                                dispatch(
                                    setPageInfo({
                                        wrapperClasses: {
                                            'wrapper--mobile-menu':
                                                !wrapperClasses[
                                                    'wrapper--mobile-menu'
                                                ],
                                        },
                                    }),
                                )
                            }
                        />
                        <Menu
                            className="show-for-large menu--fixed-header"
                            slug={MenuNames.MAIN}
                        />
                    </section>
                    <section className="columns small-6 hide-for-small-only fixed-header__section">
                        <Search />
                        <Menu
                            className="show-for-large fixed-header__social-media"
                            slug={MenuNames.SOCIAL}
                        />
                    </section>
                </div>
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
