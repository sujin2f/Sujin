/*
 * Global Footer Component
 * components/layout/GlobalFooter
 */

import React, { Fragment } from 'react'

import { FooterBottom } from 'src/frontend/components'
// import { WidgetContainer } from 'src/frontend/components/widgets'

export const Footer = (): JSX.Element => {
    return (
        <Fragment>
            <aside className="row footer__top">
                {/* <WidgetContainer
                    items={globalVars.widgets.footer}
                    itemClass="columns small-12 medium-4"
                /> */}
            </aside>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </Fragment>
    )
}
