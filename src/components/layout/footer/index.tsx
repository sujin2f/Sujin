import React from 'react'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { GoogleAdvert } from '@src/components/GoogleAdvert'
import { TagCloud } from '@src/components/layout/footer/TagCloud'
import { Flickr } from '@src/components/layout/footer/Flickr'
import { WidgetTitle } from '@src/components/WidgetTitle'
import { FooterBottom } from '@src/components/layout/footer/FooterBottom'

import '@src/scss/footer.scss'

export function Footer() {
    return (
        <footer className="footer">
            <Row className="footer__top" dom="aside">
                <Column dom="section" medium={4} small={12}>
                    <GoogleAdvert />
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
