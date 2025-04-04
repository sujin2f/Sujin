'use client'

/* Components */
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { GoogleAdvert } from '@app/_components/GoogleAdvert'
import TagCloud from '@app/_components/footer/TagCloud'
import Flickr from '@app/_components/footer/Flickr'
import { FooterBottom } from '@app/_components/footer/FooterBottom'
import Title from '@app/_components/WidgetTitle'
/* Assets */
import '@app/_components/footer/style.scss'

export const Footer = () => {
    return (
        <footer className="footer">
            <Row className="footer__top" dom="aside">
                <Column dom="section" medium={4} small={12}>
                    <GoogleAdvert responsive place="footer" />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <Title>Photo Stream</Title>
                    <Flickr />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <Title>Popular Tags</Title>
                    <TagCloud />
                </Column>
            </Row>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </footer>
    )
}
