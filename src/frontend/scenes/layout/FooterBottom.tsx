import React from 'react'
import { Link } from 'react-router-dom'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'

import Logo from '@frontend/images/logo.svg'

export function FooterBottom() {
    return (
        <Row>
            <Column className="footer__bottom__left" small={12}>
                <Link className="footer__logo hide-for-small" to="/">
                    <Logo aria-label="Sujin" />
                </Link>

                <p className="footer__copyright">
                    Copyright &copy; 2017 sujinc.com
                </p>
            </Column>
        </Row>
    )
}
