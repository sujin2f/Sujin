/*
 * Global Footer Component
 * components/layout/GlobalFooter
 */

import React, { Fragment } from 'react';

import { FooterBottom } from 'components/layout/GlobalFooter/FooterBottom';
import { WidgetContainer } from 'components/widgets';

export const GlobalFooter = (): JSX.Element => {
  return (
    <Fragment>
      <aside className="row layout__footer__top">
        <WidgetContainer items={window.sujin.widgets.footer} itemClass="columns small-12 medium-4" />
      </aside>
      <section className="layout__footer__bottom">
        <FooterBottom />
      </section>
    </Fragment>
  );
};
