/*
 * Global Footer Component
 * components/layout/GlobalFooter
 */

import React, { Fragment } from 'react'

import { FooterBottom } from 'src/frontend/components/layout/GlobalFooter/FooterBottom'
import { WidgetContainer } from 'src/frontend/components/widgets'
import { GlobalVariable } from 'src/frontend/store/items/global-variable'

export const GlobalFooter = (): JSX.Element => {
    const globalVars = GlobalVariable.getInstance(window.sujin)

    return (
        <Fragment>
            <aside className="row layout__footer__top">
                <WidgetContainer
                    items={globalVars.widgets.footer}
                    itemClass="columns small-12 medium-4"
                />
            </aside>
            <section className="layout__footer__bottom">
                <FooterBottom />
            </section>
        </Fragment>
    )
}
