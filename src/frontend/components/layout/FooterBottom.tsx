import React from 'react'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { MenuNames } from 'src/constants/mysql-query'

import { Link } from 'src/frontend/components/Link'
import { Menu } from './Menu'

export const FooterBottom = (): JSX.Element => {
    return (
        <Row>
            <Column small={12} medium={6} className="footer__bottom__left">
                <Link to="/" className="footer__logo hide-for-small-only">
                    Sujin
                </Link>
                <p className="footer__copyright">
                    Copyright &copy; 2017 sujinc.com
                </p>
            </Column>

            <Column small={12} medium={6} className="hide-for-small-only">
                <Menu
                    className="menu--footer__social-media"
                    slug={MenuNames.SOCIAL}
                />
            </Column>
        </Row>
    )
}
