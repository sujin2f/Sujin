import React, { Fragment } from 'react'

import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { GoogleAdvert } from 'src/frontend/components/widget/GoogleAdvert'
import { TagCloud } from 'src/frontend/components/widget/TagCloud'
import { Flickr } from 'src/frontend/components/widget/Flickr'
import { WidgetTitle } from 'src/frontend/components/widget/WidgetTitle'
import { FooterBottom } from './FooterBottom'

require('src/frontend/scss/footer.scss')

export const Footer = (): JSX.Element => {
    return (
        <Fragment>
            <Row className="footer__top" dom="aside">
                <Column small={12} medium={4} dom="section">
                    <GoogleAdvert
                        client={window.globalVariable.adClient}
                        slot={window.globalVariable.adSlot}
                    />
                </Column>
                <Column small={12} medium={4} dom="section">
                    <WidgetTitle>Photo Stream</WidgetTitle>
                    <Flickr />
                </Column>
                <Column small={12} medium={4} dom="section">
                    <WidgetTitle>Popular Tags</WidgetTitle>
                    <TagCloud />
                </Column>
            </Row>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </Fragment>
    )
}
