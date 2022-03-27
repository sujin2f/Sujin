import React, { Fragment } from "react";
import {
    Flickr,
    FooterBottom,
    GoogleAdvert,
    TagCloud,
} from "src/frontend/components";

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
                <section className="widget__container columns small-12 medium-4">
                    <h2 className="widget__heading">
                        <span>Popular Tags</span>
                    </h2>
                    <TagCloud />
                </section>
            </aside>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </Fragment>
    );
};
