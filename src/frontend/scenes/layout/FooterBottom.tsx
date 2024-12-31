import React from 'react'
import { Link } from 'react-router-dom'

import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

import Logo from 'src/frontend/images/logo.svg'

export const FooterBottom = (): JSX.Element => {
    return (
        <Row>
            <Column small={12} className="footer__bottom__left">
                <Link to="/" className="footer__logo hide-for-small">
                    <Logo aria-label="Sujin" />
                </Link>
                <p className="footer__copyright">
                    Copyright &copy; 2017 sujinc.com
                </p>
            </Column>
        </Row>
    )
}
