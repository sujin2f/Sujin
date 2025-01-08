import React from 'react'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { GoogleAdvert } from '@frontend/components/widget/GoogleAdvert'
import { TagCloud } from '@frontend/components/widget/TagCloud'
import { Flickr } from '@frontend/components/widget/Flickr'
import { WidgetTitle } from '@frontend/components/widget/WidgetTitle'
import { FooterBottom } from './FooterBottom'

import 'src/frontend/scss/footer.scss'

export function Footer() {
    return (
        <footer className="footer">
            <Row className="footer__top" dom="aside">
                <Column dom="section" medium={4} small={12}>
                    <GoogleAdvert
                        client={window.sujin.GOOGLE_AD_CLIENT}
                        slot={window.sujin.GOOGLE_AD_SLOT}
                    />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <WidgetTitle>Photo Stream</WidgetTitle>

                    <Flickr />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <WidgetTitle>Popular Tags</WidgetTitle>

                    <TagCloud />
                </Column>
            </Row>

            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </footer>
    )
}
