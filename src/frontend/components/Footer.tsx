/*
 * Global Footer Component
 * components/layout/GlobalFooter
 */

import React, { Fragment } from 'react'

import { Flickr, FooterBottom, GoogleAdvert } from 'src/frontend/components'

export const Footer = (): JSX.Element => {
    return (
        <Fragment>
            <aside className="row footer__top">
                <section className="widget__container columns small-12 medium-4">
                    <GoogleAdvert
                        client={window.globalVariable.adClient}
                        slot={window.globalVariable.adSlot}
                    />
                </section>
                <section className="widget__container columns small-12 medium-4">
                    <h2 className="widget__heading">
                        <span>Photo Stream</span>
                    </h2>
                    <Flickr />
                </section>
            </aside>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </Fragment>
    )
}
