/*
 * Global Footer Bottom Element Component
 * components/layout/GlobalFooter/FooterBottom
 */

import React from 'react'
import { MenuNames } from 'src/constants'

import { Link, Menu } from 'src/frontend/components'

export const FooterBottom = (): JSX.Element => {
    return (
        <div className="row">
            <div className="columns medium-6 small-12 footer__bottom__left">
                <Link to="/" className="footer__logo hide-for-small-only">
                    Sujin
                </Link>
                <p className="footer__copyright">
                    Copyright &copy; 2017 sujinc.com
                </p>
            </div>

            <Menu
                className="hide-for-small-only columns medium-6 small-12 menu--footer__social-media"
                slug={MenuNames.SOCIAL}
            />
        </div>
    )
}
