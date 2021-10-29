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
                                    setPageInfo({
                                        wrapperClasses: {
                                            'mobile-menu': !wrapperClasses[
                                                'mobile-menu'
                                            ],
                                        },
                                    }),
                                )
                            }
                        />
                        <Menu
                            className="show-for-large menu__fixed__primary"
                            slug={MenuNames.MAIN}
                        />
                    </section>
                    <section className="columns small-6 hide-for-small-only">
                        <Search />
                        <Menu
                            className="show-for-large menu__fixed__social-media"
                            slug={MenuNames.SOCIAL}
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
                slug={MenuNames.MAIN}
            />
        </section>
    )
}
