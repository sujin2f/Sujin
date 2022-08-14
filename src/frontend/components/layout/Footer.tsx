import React, { Fragment } from 'react'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { GoogleAdvert, TagCloud, Flickr } from 'src/frontend/components/widget'
import { FooterBottom } from './FooterBottom'

export const Footer = (): JSX.Element => {
    return (
        <Fragment>
            <Row className="footer__top" dom="aside">
                <Column
                    small={12}
                    medium={4}
                    className="widget__container"
                    dom="section"
                >
                    <GoogleAdvert
                        client={window.globalVariable.adClient}
                        slot={window.globalVariable.adSlot}
                    />
                </Column>
                <Column
                    small={12}
                    medium={4}
                    className="widget__container"
                    dom="section"
                >
                    <h2 className="widget__heading">
                        <span>Photo Stream</span>
                    </h2>
                    <Flickr />
                </Column>
                <Column
                    small={12}
                    medium={4}
                    className="widget__container"
                    dom="section"
                >
                    <h2 className="widget__heading">
                        <span>Popular Tags</span>
                    </h2>
                    <TagCloud />
                </Column>
            </Row>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </Fragment>
    )
}
