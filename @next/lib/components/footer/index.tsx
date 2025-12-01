'use server'
/* Components */
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { GoogleAdvert } from '@common/components/GoogleAdvert'
import TagCloud from '@lib/components/footer/TagCloud'
import Flickr from '@lib/components/footer/Flickr'
import { FooterBottom } from '@lib/components/footer/FooterBottom'
import { WidgetTitle } from '@lib/components/WidgetTitle'
/* Utils */
import { flickr as getFlickr } from '@lib/apollo/queries/misc/flickr'
import { tagCloud as getTagCloud } from '@lib/apollo/queries/wordpress/archives/tagCloud'
import { redisCachedRequest } from '@lib/apollo/queries/GQLRequest'
/* Assets */
import './index.scss'
import { COLLECTION } from '@sujin/lib/constants'

export const Footer = async () => {
    async function requestFlickr() {
        'use server'
        return await redisCachedRequest(async () => await getFlickr(), {
            key: `flickr`,
        }).catch(() => [])
    }
    async function requestTagCloud() {
        'use server'
        return await redisCachedRequest(async () => await getTagCloud(), {
            key: `${COLLECTION.ARCHIVE}-tagCloud`,
        }).catch(() => [])
    }

    return (
        <footer className="footer">
            <Row className="footer__top" dom="aside">
                <Column dom="section" medium={4} small={12}>
                    <GoogleAdvert
                        responsive
                        place="footer"
                        clientId={`${process.env.GOOGLE_AD_CLIENT}`}
                        slot={`${process.env.GOOGLE_AD_SLOT_FOOTER}`}
                    />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <WidgetTitle>Photo Stream</WidgetTitle>
                    <Flickr action={requestFlickr} />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <WidgetTitle>Popular Tags</WidgetTitle>
                    <TagCloud action={requestTagCloud} />
                </Column>
            </Row>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </footer>
    )
}
